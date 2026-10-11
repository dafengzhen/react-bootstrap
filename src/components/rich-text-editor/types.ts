import type { HTMLAttributes, ReactNode } from 'react';

import type {
  Attrs,
  Editor,
  EditorLocale,
  EditorState,
  EditorView,
  Extension,
  FileUploader,
  NodeJSON,
} from './rich-text-editor-lib.ts';

/** What every control inside the component reads from the context. */
export interface RichTextEditorContextValue {
  /** Whether the command named `name` could run right now; a read-only editor answers `false`. */
  can: (name: string, options?: Attrs) => boolean;
  /** Whether the editor accepts edits. */
  editable: boolean;
  /** The editor being controlled. */
  editor: Editor;
  /** Attributes of the innermost node or mark named `name` at the selection. */
  getAttributes: (name: string) => Attrs;
  /** Whether `name` is active at the selection. */
  isActive: (name: string, attrs?: Attrs) => boolean;
  /**
   * Runs a registered command by name.
   *
   * The selection survives a toolbar press because every control in this component cancels the
   * default of its pointer-down; a dialog does it by restoring the range it captured when it opened.
   */
  run: (name: string, options?: Attrs) => boolean;
  /**
   * The state the toolbar renders from, re-read after every transaction.
   *
   * A host building its own controls reads it the same way: the component subscribes to the editor
   * with `useSyncExternalStore`, so a snapshot change re-renders the controls that use this context.
   */
  state: EditorState;
}

/**
 * Format the painter is holding between "copy" and "apply".
 *
 * The marks are stored as data rather than as `Mark` instances: a `Mark` belongs to the schema that
 * built it, and the command that paints them runs after a re-render, against whatever state the
 * editor has by then.
 */
export interface RichTextEditorFormatPainter {
  /** Marks of the sampled range. */
  marks: { attrs: Attrs; type: string }[];
  /** Block attributes to copy, when the sample was taken inside a block that has any. */
  nodeAttrs: Attrs;
  /** Node name of the sampled block, so a heading is painted as a heading. */
  nodeName: string;
}

/** One group of the image gallery, as the host hands it over. */
export interface RichTextEditorGalleryGroup {
  /** Images of the group. */
  images: RichTextEditorImage[];
  /** Heading shown above the group. */
  label: string;
}

/** The imperative handle {@link RichTextEditor} exposes through its ref. */
export interface RichTextEditorHandle {
  /** Focuses the edit area. */
  focus: () => void;
  /** The editor this component owns. */
  getEditor: () => Editor;
  /** The document as HTML. */
  getHTML: () => string;
  /** The document as JSON, the shape `defaultValue` accepts back. */
  getJSON: () => NodeJSON;
  /** The document as Markdown. */
  getMarkdown: () => string;
  /** The document as plain text. */
  getText: () => string;
  /** The view rendering the editor, or `null` before it is mounted. */
  getView: () => EditorView | null;
  /** Redoes the last undone edit. */
  redo: () => void;
  /** Replaces the document with an HTML string. */
  setHTML: (html: string) => void;
  /** Replaces the document with JSON. */
  setJSON: (content: NodeJSON) => void;
  /** Undoes the last edit. */
  undo: () => void;
}

/** An image offered by the toolbar's gallery. */
export interface RichTextEditorImage {
  /** Text alternative stored on the node. */
  alt?: string;
  /** Intrinsic height in pixels, when the host knows it. */
  height?: number;
  /** Stable identifier of the asset in the host's library. */
  id: string;
  /** Source URL; a `data:` URL carrying an image is accepted, anything else follows the URL policy. */
  src: string;
  /** Caption shown under the image in the picker. */
  title?: string;
  /** Intrinsic width in pixels, when the host knows it. */
  width?: number;
}

/** Panel a toolbar control can open; at most one is open at a time. */
export type RichTextEditorPanel =
  | 'block-type'
  | 'color'
  | 'datetime'
  | 'emoji'
  | 'font-family'
  | 'font-size'
  | 'highlight'
  | 'insert'
  | 'line-height'
  | 'spacing'
  | 'symbol'
  | 'table'
  | null;

/** Props of the rich text editor. */
export interface RichTextEditorProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'content' | 'defaultValue' | 'onChange'
> {
  /** Extra classes for the root element. */
  className?: string;
  /**
   * Document the editor starts with.
   *
   * HTML is accepted because that is what a form field usually holds; a JSON document is accepted
   * as well, which skips the parse and cannot be refused by the sanitizer. Changing the prop after
   * mount replaces the document, so the component stays usable in a controlled form.
   */
  content?: NodeJSON | string;
  /** Whether the editor accepts edits. Defaults to `true`. */
  editable?: boolean;
  /**
   * Extensions of the editor, replacing the default set.
   *
   * The default is the starter kit, the media kit and the extended kit, which is what the toolbar
   * controls; passing a list of your own takes over both the schema and the commands.
   */
  extensions?: Extension[];
  /** Gallery shown by the image dialog's gallery tab. */
  gallery?: RichTextEditorGalleryGroup[];
  /** Whether the toolbar is left out. Defaults to `false`, so the toolbar renders. */
  hideToolbar?: boolean;
  /** Copy the edit area writes into the DOM; see the engine's `EditorLocale`. */
  locale?: EditorLocale;
  /** Called after every change, with the editor holding the new document. */
  onChange?: (editor: Editor) => void;
  /** Called after every change, with the document as HTML. */
  onHTMLChange?: (html: string) => void;
  /** Placeholder shown while the document is empty. */
  placeholder?: string;
  /** Extra controls rendered at the end of the toolbar. */
  toolbarExtra?: ReactNode;
  /** Upload adapters; without them the upload buttons report that they cannot run. */
  upload?: { file?: FileUploader; image?: FileUploader };
}
