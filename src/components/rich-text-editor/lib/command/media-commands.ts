import type { Editor, EditorOptions } from '../editor.ts';
import type { RuntimeExtensionContext } from '../extension/extension.ts';
import type { Node as DocNode } from '../model/node.ts';
import type { ResolvedPos } from '../position/resolved-pos.ts';
import type { Schema } from '../schema/schema.ts';
import type {
  AttachmentAttrs,
  AudioAttrs,
  ImageAttrs,
  VideoAttrs,
  VideoProvider,
} from '../serialization/link.ts';
import type { FileUploader, UploadResult } from '../serialization/types.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { Transaction } from '../state/transaction.ts';
import type { Attrs } from '../util/object.ts';
import type { Command } from './command.ts';

import { Fragment } from '../model/fragment.ts';
import { Slice } from '../model/slice.ts';
import { applyUploadAction, failUpload, startUpload } from '../plugins/upload.ts';
import { TextSelection } from '../selection/text-selection.ts';
import { sanitizeUrl } from '../serialization/sanitize.ts';
import { planReplace, replaceStep } from '../transform/replace.ts';

/**
 * Commands that put media into the document.
 *
 * An image replaces the selection and leaves the caret after itself; the block sized media — video,
 * audio, attachment — land after the block the selection is in, like `insertHorizontalRule`. A URL
 * the sanitizer rejects makes the command report `false` and leaves the document alone, so an
 * unsafe `src` can neither be inserted nor offered by `editor.can()`.
 */

/**
 * What a media command needs from the editor it belongs to: a command receives an `EditorState` and
 * nothing else, so the upload adapters cannot be handed to it directly. {@link mediaCommands}
 * registers the editor here, keyed by the schema (`state.schema` is that very object), and an entry
 * lives as long as its schema, so two editors never share one and a later upload reads the *current*
 * state.
 */
export interface MediaRuntime {
  /** Editor the media commands belong to. */
  editor: Editor;
  /** Upload adapters of that editor. */
  upload: EditorOptions['upload'];
  /** Running uploads, by task id. */
  readonly uploads: Map<string, RunningUpload>;
}

/** Options of {@link uploadAndInsert}. */
export interface UploadInsertOptions {
  /** Content the uploaded file becomes; defaults to an attachment (`"file"`). */
  kind?: UploadKind;
}

/** Content an uploaded file becomes. */
export type UploadKind = 'file' | 'image';

/** How a media atom becomes part of the document. */
type InsertMode = 'block' | 'inline';

/** Where an atom goes, and whether the schema allows it. */
interface InsertPlan {
  /** Position right after the inserted atom. */
  after: number;
  /** Where the atom is inserted, or the start of the replaced range. */
  from: number;
  /** Whether the atom replaces the selection instead of following its block. */
  inline: boolean;
  slice: Slice;
  /** End of the replaced range. */
  to: number;
}

/** Video providers the node understands, mirroring `VideoProvider`. */
const VIDEO_PROVIDERS: readonly string[] = ['bilibili', 'custom', 'native', 'vimeo', 'youtube'];

/** Runtime per registered schema, one per editor. */
const runtimes = new WeakMap<Schema, MediaRuntime>();

/** Counter behind the task ids; an id is unique within one editor. */
let uploadCounter = 0;

/**
 * Where a file will be inserted once its upload finishes: the state the command saw is stale by
 * then, so the node goes into the current document at the position the selection occupied when the
 * file was dropped, mapped forward through every transaction since ({@link updateUploadAnchors}
 * keeps it current). `deleted` marks that the content there was removed meanwhile, so the insertion
 * falls back to the selection.
 */
interface RunningUpload {
  /** Aborts the request when the editor goes away. */
  readonly controller: AbortController;
  /** Whether that content was deleted since the drop. */
  deleted: boolean;
  readonly kind: UploadKind;
  /** Position to insert at, mapped through every transaction since the drop. */
  pos: number;
}

/**
 * Cancels every upload that is still running for `schema`.
 *
 * @internal
 */
export function abortUploadsFor(schema: Schema): void {
  abortRuntimes(schema);
}

/** Inserts an attachment block after the selection's block. */
export function insertAttachment(attrs: AttachmentAttrs): Command {
  return insertAtom('attachment', 'block', () => attachmentAttrs(attrs));
}

/** Inserts an audio player block after the selection's block. */
export function insertAudio(attrs: AudioAttrs): Command {
  return insertAtom('audio', 'block', () => audioAttrs(attrs));
}

/** Inserts an inline image at the selection, replacing it. */
export function insertImage(attrs: ImageAttrs): Command {
  return insertAtom('image', 'inline', () => imageAttrs(attrs));
}

/** Inserts a video block after the selection's block. */
export function insertVideo(attrs: VideoAttrs): Command {
  return insertAtom('video', 'block', () => videoAttrs(attrs));
}

/**
 * Commands the media extension registers, in the shape `editor.commands` exposes.
 *
 * The options of a registered command are a loose attribute bag, so each factory here turns them
 * into the typed attributes of its node, and `insertImage({ src })` and
 * `editor.commands.insertImage({ src })` describe the same insertion. Registering them is also what
 * records the editor in {@link registerMediaRuntime}, which is how `uploadAndInsert` reaches
 * `editor.upload`.
 */
export function mediaCommands(
  context: RuntimeExtensionContext,
): Record<string, (options?: Attrs) => Command> {
  registerMediaRuntime(context.schema, {
    editor: context.editor,
    upload: context.editor.upload,
    uploads: new Map(),
  });

  return {
    insertAttachment: (options) => insertAttachment(attachmentAttrsFrom(options)),
    insertAudio: (options) => insertAudio(audioAttrsFrom(options)),
    insertImage: (options) => insertImage(imageAttrsFrom(options)),
    insertVideo: (options) => insertVideo(videoAttrsFrom(options)),
    uploadAndInsert: (options) => uploadCommandFrom(options),
  };
}

/** The runtime a schema was registered with, if any. */
export function mediaRuntimeFor(schema: Schema): MediaRuntime | undefined {
  return runtimes.get(schema);
}

/**
 * Records the editor a schema belongs to, so its media commands find the uploaders.
 * {@link mediaCommands} calls this while the editor is being built; an extension that ships its own
 * media commands calls it the same way.
 */
export function registerMediaRuntime(schema: Schema, runtime: MediaRuntime): void {
  runtimes.set(schema, runtime);
}

/**
 * Carries the insertion points of running uploads through a transaction: an upload that finishes
 * later has to be inserted where it was dropped, and every document change moves every position.
 * One lookup per running upload per edit beats re-walking every transaction the editor ever
 * applied.
 *
 * Called by `Editor.dispatch` after a transaction was accepted.
 *
 * @internal
 */
export function updateUploadAnchors(schema: Schema, transaction: Transaction): void {
  const runtime = runtimes.get(schema);

  if (!runtime || runtime.uploads.size === 0 || !transaction.docChanged) {
    return;
  }

  for (const upload of runtime.uploads.values()) {
    const mapped = transaction.mapping.mapResult(upload.pos, 1);

    // A position a step deleted has no home left: it stays where mapping put it so a later insert
    // can be placed near it, while `deleted` makes the insertion fall back to the selection.
    upload.deleted = upload.deleted || mapped.deleted || mapped.deletedAfter;
    upload.pos = mapped.pos;
  }
}

/**
 * Uploads `file` and inserts the result where the command was run.
 *
 * The uploader comes from `editor.upload` (design §85: uploading is an adapter, never part of the
 * core), picked by `kind`: `"image"` uses `upload.image`, `"file"` uses `upload.file`, and either
 * falls back to the other one. Without a matching uploader the command reports `false`.
 *
 * It returns as soon as the upload started: the file becomes an image or an attachment when the
 * uploader resolves, and the upload plugin's status (design §70) moves from `"uploading"` to
 * `"success"` or `"error"` without ever reaching the document. The insertion point is the selection
 * the command saw, carried forward through every transaction since — see {@link RunningUpload}.
 */
export function uploadAndInsert(file: File, options: UploadInsertOptions = {}): Command {
  const kind = options.kind ?? 'file';

  return (state, dispatch) => {
    const runtime = mediaRuntimeFor(state.schema);

    if (!runtime) {
      return false;
    }

    const uploader = uploaderFor(runtime.upload, kind);

    if (!uploader) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const id = nextUploadId();
    const controller = new AbortController();

    runtime.uploads.set(id, { controller, deleted: false, kind, pos: state.selection.from });
    dispatch(startUpload(state, { id, name: file.name, size: file.size }));

    void uploader
      .upload(file, { id, signal: controller.signal })
      .then((result) => insertUploaded(runtime, id, file, result))
      .catch((error: unknown) => {
        runtime.uploads.delete(id);

        if (controller.signal.aborted) {
          // The editor is going away, or the caller cancelled: nobody waits for this failure.
          return;
        }

        runtime.editor.dispatch(failUpload(runtime.editor.state, id, errorText(error)));
      });

    return true;
  };
}

/** Cancels the running uploads of `schema`. */
function abortRuntimes(schema: Schema): void {
  const runtime = runtimes.get(schema);

  if (!runtime) {
    return;
  }

  for (const upload of runtime.uploads.values()) {
    upload.controller.abort();
  }

  runtime.uploads.clear();
}

/** Attachment attrs, or `null` when `url` is unsafe. */
function attachmentAttrs(attrs: AttachmentAttrs): Attrs | null {
  const url = sanitizeUrl(attrs.url);

  return url === '' ? null : { ...attrs, url };
}

/** Attachment attrs from a registered command's loose options. */
function attachmentAttrsFrom(options: Attrs | undefined): AttachmentAttrs {
  return {
    id: optionalString(options?.id),
    mimeType: optionalString(options?.mimeType),
    name: String(options?.name ?? ''),
    size: optionalNumber(options?.size),
    url: String(options?.url ?? ''),
  };
}

/** Audio attrs, or `null` when `src` is unsafe. */
function audioAttrs(attrs: AudioAttrs): Attrs | null {
  const src = sanitizeUrl(attrs.src);

  return src === '' ? null : { ...attrs, src };
}

/** Audio attrs from a registered command's loose options. */
function audioAttrsFrom(options: Attrs | undefined): AudioAttrs {
  return {
    mimeType: optionalString(options?.mimeType),
    src: String(options?.src ?? ''),
    title: optionalString(options?.title),
  };
}

/** Depth of the deepest non-text node at `pos`, as `list-commands` walks it. */
function blockDepthAt(doc: DocNode, pos: number): number {
  const $pos = doc.resolve(pos);

  for (let depth = $pos.depth; depth > 0; depth--) {
    if (!$pos.node(depth).isText) {
      return depth;
    }
  }

  return 0;
}

/**
 * Where a block atom goes, relative to the block the selection is in.
 *
 * The position directly behind a block belongs to the *next* block, so the atom goes in front of
 * that one: a document has no position of its own between two siblings, and rebuilding the
 * following block leaves the selection inside the current one alone. A last child has nothing in
 * front of it, so the atom is appended to the parent; a selection between two blocks — a view can
 * put it there — is answered by the block after it.
 */
function blockTarget($pos: ResolvedPos): { from: number; next: DocNode | null } | null {
  const depth = blockDepthAt($pos.doc, $pos.pos);

  if (depth === 0) {
    const next = $pos.nodeAfter();

    if (next && !next.isText && !next.isInline) {
      return { from: $pos.pos, next };
    }

    // The end of the parent's content is the one place a block can always be added to.
    return { from: $pos.end(), next: null };
  }

  const next = $pos.node(depth - 1).maybeChild($pos.index(depth - 1) + 1);

  return { from: $pos.after(depth), next: next ?? null };
}

/** Node of `name`, or `null` when the schema has no such type or the attrs are unsafe. */
function buildNode(state: EditorState, name: string, attrs: Attrs | null): DocNode | null {
  const type = state.schema.nodes[name];

  return type && attrs ? type.create(attrs) : null;
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** The file in the `uploadAndInsert` options, or `null` when there is none. */
function fileFrom(value: unknown): File | null {
  return typeof File !== 'undefined' && value instanceof File ? value : null;
}

/** Image attrs, or `null` when `src` is unsafe. */
function imageAttrs(attrs: ImageAttrs): Attrs | null {
  const src = sanitizeUrl(attrs.src);

  return src === '' ? null : { ...attrs, src };
}

/** Image attrs from a registered command's loose options. */
function imageAttrsFrom(options: Attrs | undefined): ImageAttrs {
  return {
    alt: optionalString(options?.alt),
    height: optionalNumber(options?.height),
    src: String(options?.src ?? ''),
    title: optionalString(options?.title),
    width: optionalNumber(options?.width),
  };
}

/** Inserts one media atom: inline at the selection, or after its block. */
function insertAtom(name: string, mode: InsertMode, build: () => Attrs | null): Command {
  return (state, dispatch) => {
    const node = buildNode(state, name, build());

    if (!node) {
      return false;
    }

    const tr = insertionTransaction(state, node, mode);

    if (!tr) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    tr.setMeta('historyGroup', 'media');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** Transaction inserting `node`, or `null` when the schema refuses it. */
function insertionTransaction(
  state: EditorState,
  node: DocNode,
  mode: InsertMode,
  upload?: RunningUpload,
): null | Transaction {
  const plan = planInsert(state, node, mode, upload);

  if (!plan) {
    return null;
  }

  const tr = state.tr;

  tr.replaceWith(plan.from, plan.to, plan.slice);

  if (plan.inline) {
    // The caret goes right behind the atom, which is where a user who just inserted an image
    // expects it.
    tr.setSelection(TextSelection.near(tr.doc, plan.after, 1));
  } else {
    // A block atom pushes the caret into the block behind it; at the very end of the document, or
    // behind an atom only, no position behind it can hold a cursor, so the caret stays where the
    // insertion maps it — what `insertHorizontalRule` does as well.
    const cursor = TextSelection.near(tr.doc, plan.after, 1);

    if (cursor.from > plan.after && cursor.from < tr.doc.content.size) {
      tr.setSelection(cursor);
    }
  }

  return tr.docChanged ? tr : null;
}

/** Inserts a finished upload, or records that it could not be. */
function insertUploaded(runtime: MediaRuntime, id: string, file: File, result: UploadResult): void {
  const running = runtime.uploads.get(id);

  runtime.uploads.delete(id);

  if (!running) {
    // The upload was cancelled while it was in flight, so there is nothing to place.
    return;
  }

  const editor = runtime.editor;
  const state = editor.state;
  const target = uploadTarget(running.kind);
  const node = buildNode(
    state,
    target.name,
    running.kind === 'image' ? uploadedImage(file, result) : uploadedAttachment(file, result),
  );
  const tr = node ? insertionTransaction(state, node, target.mode, running) : null;

  if (!tr) {
    editor.dispatch(failUpload(state, id, 'The uploaded file cannot be inserted at the selection'));

    return;
  }

  applyUploadAction(tr, { id, type: 'finish', url: result.url });
  editor.dispatch(tr);
}

function nextUploadId(): string {
  uploadCounter += 1;

  return `upload_${uploadCounter}`;
}

/** `value` as a finite number, else `undefined`. */
function optionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

/** `value` as a string, else `undefined`; `''` counts as none. */
function optionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return String(value);
}

/** Sanitized `value`; `null` when unsafe, `undefined` when absent. */
function optionalUrl(value: string | undefined): null | string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const url = sanitizeUrl(value);

  return url === '' ? null : url;
}

/** The slice to insert, or `null` when the schema refuses it there. */
function planInsert(
  state: EditorState,
  node: DocNode,
  mode: InsertMode,
  upload?: RunningUpload,
): InsertPlan | null {
  const anchored = upload ? uploadSelection(state, upload) : null;
  const { from, to } = anchored === null ? state.selection : { from: anchored, to: anchored };
  const slice = Slice.fromNode(node);

  if (mode === 'inline') {
    const plan = planReplace(state.doc, from, to, slice);

    return plan ? { after: plan.cursor, from, inline: true, slice, to } : null;
  }

  const target = blockTarget(state.doc.resolve(from));

  if (!target) {
    return null;
  }

  const next = target.next;

  if (!next) {
    const append = replaceStep(state.doc, target.from, target.from, slice);

    return append
      ? {
          after: target.from + node.nodeSize,
          from: target.from,
          inline: false,
          slice,
          to: target.from,
        }
      : null;
  }

  const before = new Slice(Fragment.from([node, next]), 0, 0);
  const result = replaceStep(state.doc, target.from, target.from + next.nodeSize, before);

  return result
    ? {
        after: target.from + node.nodeSize,
        from: target.from,
        inline: false,
        slice: before,
        to: target.from + next.nodeSize,
      }
    : null;
}

/** Provider of a video node, checked against the values it knows. */
function providerFrom(value: unknown): VideoProvider {
  const provider = optionalString(value) ?? 'native';

  // Registered-command options are loose, so an unknown provider falls back to `native`.
  return VIDEO_PROVIDERS.includes(provider) ? (provider as VideoProvider) : 'native';
}

/** The upload command behind `editor.commands.uploadAndInsert`. */
function uploadCommandFrom(options: Attrs | undefined): Command {
  const file = fileFrom(options?.file);

  if (!file) {
    return () => false;
  }

  return uploadAndInsert(file, { kind: options?.kind === 'image' ? 'image' : 'file' });
}

/** Attachment attrs of an uploaded file. */
function uploadedAttachment(file: File, result: UploadResult): Attrs | null {
  return attachmentAttrs({
    mimeType: result.mimeType ?? optionalString(file.type),
    name: file.name,
    size: file.size,
    url: result.url,
  });
}

/** Image attrs of an uploaded file. */
function uploadedImage(file: File, result: UploadResult): Attrs | null {
  return imageAttrs({
    alt: file.name,
    height: result.height,
    src: result.url,
    width: result.width,
  });
}

/** Adapter for `kind`, else the other one; `null` when there is none. */
function uploaderFor(upload: EditorOptions['upload'], kind: UploadKind): FileUploader | null {
  if (!upload) {
    return null;
  }

  const preferred = kind === 'image' ? upload.image : upload.file;
  const fallback = kind === 'image' ? upload.file : upload.image;

  return preferred ?? fallback ?? null;
}

/** Where an upload's node goes: its anchor if it survived, else the selection. */
function uploadSelection(state: EditorState, upload: RunningUpload): null | number {
  if (upload.deleted) {
    return null;
  }

  const size = state.doc.content.size;

  return upload.pos < 0 || upload.pos > size ? null : upload.pos;
}

/** Node an uploaded file becomes, and how it is placed. */
function uploadTarget(kind: UploadKind): { mode: InsertMode; name: string } {
  return kind === 'image'
    ? { mode: 'inline', name: 'image' }
    : { mode: 'block', name: 'attachment' };
}

/** Video attrs, or `null` when one of its URLs is unsafe. */
function videoAttrs(attrs: VideoAttrs): Attrs | null {
  const url = optionalUrl(attrs.url);
  const poster = optionalUrl(attrs.poster);

  if (url === null || poster === null) {
    return null;
  }

  return { ...attrs, poster: poster ?? null, url: url ?? null };
}

/** Video attrs from a registered command's loose options. */
function videoAttrsFrom(options: Attrs | undefined): VideoAttrs {
  return {
    id: optionalString(options?.id),
    poster: optionalString(options?.poster),
    provider: providerFrom(options?.provider),
    url: optionalString(options?.url),
  };
}
