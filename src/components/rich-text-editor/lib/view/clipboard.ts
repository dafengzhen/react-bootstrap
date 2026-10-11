import type { NodeType } from '../model/node-type.ts';
import type { Node as DocNode } from '../model/node.ts';
import type { ResolvedPos } from '../position/resolved-pos.ts';
import type { Schema } from '../schema/schema.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { Transaction } from '../state/transaction.ts';
import type { RenderContext } from './dom-renderer.ts';
import type { DOMRules } from './dom-rules.ts';

import { GROUP_META } from '../history/history-plugin.ts';
import { Fragment } from '../model/fragment.ts';
import { Slice } from '../model/slice.ts';
import { TextSelection } from '../selection/text-selection.ts';
import { deleteSelection } from '../transform-commands/basic-editing.ts';
import { sliceBetween } from '../transform/slice-building.ts';
import { ErrorCode, viewError } from '../util/errors.ts';
import { parseHTML, parsePlainText } from './dom-parser.ts';
import { createViewMaps, renderNode } from './dom-renderer.ts';
import { defaultDOMRules, mergeDOMRules, rulesForSchema } from './dom-rules.ts';

/** Options shared by the clipboard helpers. */
export interface ClipboardOptions {
  /** Document the payload is rendered in; defaults to the global one. */
  document?: Document;
  /** Extra DOM rules, merged over the defaults. */
  rules?: DOMRules;
  /** Schema of the document the payload belongs to. */
  schema: Schema;
}

/** What a copy, cut or paste carries. */
export interface ClipboardPayload {
  /** HTML flavour of the payload, written by a copy and read by a paste. */
  html?: string;
  /** Plain text flavour of the payload. */
  text?: string;
}

/** How a paste splices blocks into the block the caret sits in. */
interface PastePlan {
  /** Where the caret belongs afterwards. */
  caret: number;
  /** Content that replaces the block around the caret. */
  fragment: Fragment;
  /** Document range the replacement covers. */
  from: number;
  to: number;
}

/**
 * Copies, cuts and pastes through the document model (design §41).
 *
 * The clipboard is a place, not a source of truth: everything a paste brings in is sanitized,
 * parsed into the schema and inserted through a transaction. The DOM document is read lazily, so a
 * headless caller can still move plain text.
 *
 * @example
 * ```ts
 * const clipboard = new ClipboardManager({ schema: editor.schema });
 * const { payload, transaction } = clipboard.cut(editor.state);
 * ```
 */
export class ClipboardManager {
  private readonly options: ClipboardOptions;

  constructor(options: ClipboardOptions) {
    this.options = options;
  }

  /** Payload for the current selection. */
  copy(state: EditorState): ClipboardPayload {
    const { from, to } = state.selection;

    return {
      html: serializeRange(state.doc, from, to, this.options),
      text: state.doc.textBetween(from, to, '\n\n'),
    };
  }

  /** Payload plus the transaction that removes the selection, if any. */
  cut(state: EditorState): { payload: ClipboardPayload; transaction: null | Transaction } {
    const payload = this.copy(state);
    const { empty } = state.selection;

    if (empty) {
      return { payload, transaction: null };
    }

    let transaction: null | Transaction = null;
    deleteSelection()(state, (tr) => {
      tr.setMeta(GROUP_META, 'delete');
      transaction = tr;
    });

    return { payload, transaction };
  }

  /**
   * Transaction that inserts a payload, or `null`.
   *
   * The HTML flavour wins whenever it produces a change the schema accepts; the plain text flavour
   * is used for a plain paste, for a source that carries no HTML, and as the fallback for markup
   * this schema cannot represent. A payload bringing several blocks into a paragraph splits it at
   * the caret, so its structure survives.
   *
   * @param options - `plain` ignores the HTML flavour; `pos` inserts where a drop landed rather
   * than at the selection
   */
  paste(
    state: EditorState,
    payload: ClipboardPayload,
    options?: { plain?: boolean; pos?: number },
  ): null | Transaction {
    // A drop lands where it landed rather than where the caret is, so the paste is built from a
    // state whose selection *is* that position, and the returned transaction is based on that
    // state: a transaction is applied to the state it was created from.
    const target = options?.pos === undefined ? state : stateAt(state, options.pos);

    if (options?.plain !== true && payload.html) {
      const rich = insertFragment(
        target,
        parseHTML(payload.html, this.options.schema, this.options.rules, this.options.document),
      );

      if (rich) {
        return rich;
      }
    }

    if (typeof payload.text === 'string') {
      return insertFragment(target, parsePlainText(payload.text, this.options.schema));
    }

    return null;
  }
}

/**
 * Serializes a document range as standalone HTML.
 *
 * The nodes of the slice are rendered into a detached container. The paste, which knows the
 * selection, adjusts the boundary blocks to the context they land in.
 *
 * @param options - schema, DOM rules and document to render in
 */
export function serializeRange(
  doc: DocNode,
  from: number,
  to: number,
  options: ClipboardOptions,
): string {
  if (from >= to) {
    return '';
  }

  const document = resolveDocument(options.document);
  const container = document.createElement('div');
  const context: RenderContext = {
    document,
    maps: createViewMaps(),
    rules: clipboardRules(options),
  };
  let position = from;

  for (const child of sliceBetween(doc, from, to).content.children) {
    container.append(renderNode(child, context, position));
    position += child.nodeSize;
  }

  return container.innerHTML;
}

/** Rules a payload is rendered and parsed with. */
function clipboardRules(options: ClipboardOptions): DOMRules {
  const rules = options.rules ? mergeDOMRules(defaultDOMRules(), options.rules) : defaultDOMRules();

  return rulesForSchema(options.schema, rules);
}

/**
 * Slice that inserts `content` at the current selection.
 *
 * A selection inside a textblock inserts the content of the boundary blocks rather than the blocks
 * themselves, which keeps a paste into a paragraph from nesting a paragraph inside it. Everywhere
 * else the slice stays closed.
 */
function fitSlice(content: Fragment, state: EditorState): Slice {
  const { $from, $to } = state.selection;

  if (textblockDepth($from) < 0 || textblockDepth($to) < 0) {
    return new Slice(content, 0, 0);
  }

  const first = content.maybeChild(0);
  const last = content.maybeChild(content.childCount - 1);

  return new Slice(content, openable(first) ? 1 : 0, openable(last) ? 1 : 0);
}

/** Whether a node of `type` may hold characters. */
function holdsText(type: NodeType): boolean {
  return type.contentMatch.allowedTypes.some((candidate) => candidate.isText);
}

/** Transaction that inserts `content` at the selection, or `null` when nothing changed. */
function insertFragment(state: EditorState, content: Fragment): null | Transaction {
  if (content.size === 0) {
    return null;
  }

  const plan = splitPlan(state, content);

  if (plan) {
    const spliced = state.tr;

    spliced.replaceWith(plan.from, plan.to, plan.fragment);

    if (spliced.docChanged) {
      spliced.setSelection(TextSelection.near(spliced.doc, plan.caret, -1));
      spliced.setMeta(GROUP_META, 'paste');

      return spliced;
    }
  }

  const tr = state.tr;

  tr.replaceSelection(fitSlice(content, state));

  if (!tr.docChanged) {
    return null;
  }

  tr.setMeta(GROUP_META, 'paste');

  return tr;
}

/** Whether `node` can be opened, so that its content is inserted in its place. */
function openable(node: DocNode | undefined): boolean {
  return !!node && !node.isLeaf && holdsText(node.type);
}

/** Whether `node` belongs to block content rather than to a line of characters. */
function openBlock(node: DocNode): boolean {
  return !node.isInline && !node.isText;
}

/** Document a payload is rendered in. */
function resolveDocument(domDocument?: Document): Document {
  const document: Document | undefined = domDocument ?? globalThis.document;

  if (!document) {
    throw viewError(
      ErrorCode.DOM_UNAVAILABLE,
      'Serializing a range needs a DOM document; pass one or run in a browser',
    );
  }

  return document;
}

/**
 * Plan that splices blocks into the textblock the caret sits in, or `null`.
 *
 * Blocks cannot live inside a paragraph, so the block around the caret is split at the caret rather
 * than flattened: its content before the caret opens the first pasted block, its content after the
 * caret closes the last one, and the blocks between are inserted as they stand. An empty block
 * around the caret therefore disappears rather than leaving a blank paragraph behind, and
 * characters next to the caret join the pasted line. A payload of one block holding characters is
 * left to {@link insertFragment}'s plain insert, which keeps the caret in the paragraph it was in.
 */
function splitPlan(state: EditorState, content: Fragment): null | PastePlan {
  const { $from, empty } = state.selection;
  const depth = textblockDepth($from);

  if (!empty || depth <= 0) {
    return null;
  }

  const blocks = content.children;

  if (
    blocks.length === 0 ||
    !blocks.every(openBlock) ||
    (blocks.length === 1 && openable(blocks[0]))
  ) {
    return null;
  }

  const parent = $from.node(depth);
  const base = $from.start(depth);
  const before = parent.content.cut(0, $from.pos - base);
  const after = parent.content.cut($from.pos - base);
  const kept = [...blocks];
  const parts: DocNode[] = [];

  // Putting the content before the caret in place of the first pasted block's own content is what
  // keeps a paste into the middle of a line on one line. That block is consumed, so it cannot also
  // be appended below.
  let pending: DocNode | null = null;

  if (before.size > 0) {
    const first = kept.shift();

    if (first && openable(first)) {
      pending = parent.type.create(parent.attrs, before.append(first.content));
    } else {
      if (first) {
        kept.unshift(first);
      }

      pending = parent.type.create(parent.attrs, before);
    }
  }

  // The content after the caret closes the last pasted block, so that block is consumed too — but
  // only when it is still the last one, which it is not once the first block was the only one and
  // the content before the caret took its place.
  if (after.size > 0) {
    const last = kept.pop();

    if (last && openable(last)) {
      kept.push(parent.type.create(parent.attrs, last.content.append(after)));
    } else {
      if (last) {
        kept.push(last);
      }

      kept.push(parent.type.create(parent.attrs, after));
    }
  }

  if (pending) {
    parts.push(pending);
  }

  parts.push(...kept);

  const fragment = Fragment.from(parts);

  // Every pasted block is inserted in full, so the caret belongs the size of the payload past the
  // splice start. Ending at the fragment's own end would leave the caret behind the text that used
  // to follow it, not in front of it.
  return {
    caret: $from.pos + content.size,
    fragment,
    from: base - 1,
    to: base + parent.content.size + 1,
  };
}

/**
 * `state` with a collapsed selection at `pos`, so a payload can be spliced in there.
 *
 * The state tree is shared, so this only moves the selection; the caller must build its transaction
 * from what this returns, never from the *old* state.
 */
function stateAt(state: EditorState, pos: number): EditorState {
  const tr = state.tr;

  tr.setTextSelection(Math.max(0, Math.min(pos, state.doc.content.size)));

  return state.apply(tr);
}

/**
 * Depth of the textblock a resolved position sits in, or `-1`.
 *
 * A position inside characters resolves through the text node that holds them, so the block is the
 * deepest node on the path that can hold inline content rather than the position's parent.
 */
function textblockDepth($pos: ResolvedPos): number {
  for (let depth = $pos.depth; depth > 0; depth--) {
    const node = $pos.node(depth);

    if (!node.isText && !node.isInline && holdsText(node.type)) {
      return depth;
    }
  }

  return -1;
}
