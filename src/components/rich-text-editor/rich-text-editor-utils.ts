import type {
  Attrs,
  Command,
  DocNode,
  Editor,
  EditorState,
  Mark,
  MarkType,
} from './rich-text-editor-lib.ts';
import type { RichTextEditorFormatPainter } from './types';

import { selectAll } from './lib/transform-commands/basic-editing.ts';
import { setBlockType, TextSelection as TextSelectionClass } from './rich-text-editor-lib.ts';
import { AllSelection, NodeSelection } from './rich-text-editor-lib.ts';

/**
 * The operations the toolbar needs that are not registered commands.
 *
 * The engine's command registry is the interface for anything that changes a document, and every
 * action in this file either *is* a command — built here and run through `editor.runCommand` — or
 * reads the document without changing it. Keeping them here rather than in a component means the
 * toolbar stays a rendering layer and the behaviour can be tested on a headless editor.
 */

/** One block of the document, in document order. */
export interface BlockEntry {
  /** Attributes of the block, the shape `setNodeAttr` reads. */
  attrs: Attrs;
  /** Node itself, for reading its name and content. */
  node: DocNode;
  /** Position of the block's opening token, the position a node address uses. */
  pos: number;
}

/** What the replace-all step did. */
export interface ReplaceResult {
  /** How many matches were replaced. */
  count: number;
}

/** One match of a search, in document order. */
export interface SearchMatch {
  /** End of the match, exclusive. */
  from: number;
  /** Start of the match. */
  to: number;
}

/** How a search treats letter case. */
export type SearchMode = 'case-sensitive' | 'insensitive';

/**
 * Builds the command that paints a sampled format onto the current selection.
 *
 * Marks are applied from the schema rather than from a stored `Mark`, because a `Mark` belongs to
 * the schema that built it and a command may be run against another editor's state in a test.
 */
export function applyFormatPainter(painter: RichTextEditorFormatPainter): Command {
  return (state, dispatch) => {
    if (!dispatch) {
      return true;
    }

    const { empty, from, to } = state.selection;
    const tr = state.tr;
    const sampled: { attrs: Attrs; type: MarkType }[] = [];

    for (const entry of painter.marks) {
      const type = state.schema.marks[entry.type];

      if (type) {
        sampled.push({ attrs: entry.attrs, type });
      }
    }

    if (!empty) {
      // Every mark goes first, so the painted range carries the sampled set rather than the sampled
      // set plus whatever the target happened to have.
      for (const type of Object.values(state.schema.marks)) {
        tr.removeMark(from, to, type.create());
      }

      for (const entry of sampled) {
        tr.addMark(from, to, entry.type.create(entry.attrs));
      }
    }

    const block = blockAt(state);

    if (block && Object.keys(painter.nodeAttrs).length > 0) {
      tr.setNodeAttrs(block.pos, block.node.type, { ...painter.nodeAttrs });
    }

    if (empty) {
      const stored = sampled[0];

      if (stored) {
        tr.setStoredMark(stored.type.create(stored.attrs));
      }
    }

    if (!tr.docChanged && !empty) {
      return false;
    }

    tr.setMeta('historyGroup', 'mark');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/**
 * The block the selection is in, or `null` outside a block.
 *
 * "The block containing a position" is the deepest non-text node around it, which is what
 * `setNodeAttr` and the block-type commands address.
 */
export function blockAt(state: EditorState, pos: number = state.selection.from): BlockEntry | null {
  const $pos = state.doc.resolve(pos);

  for (let depth = $pos.depth; depth > 0; depth--) {
    const node = $pos.node(depth);

    if (!node.isText) {
      return { attrs: { ...node.attrs }, node, pos: $pos.before(depth) };
    }
  }

  return null;
}

/** Document position of the block that starts at or before `pos`, for node addresses. */
export function blockPosition(doc: DocNode, pos: number): null | number {
  const $pos = doc.resolve(pos);

  for (let depth = $pos.depth; depth > 0; depth--) {
    if (!$pos.node(depth).isText) {
      return $pos.before(depth);
    }
  }

  return null;
}

/**
 * Every match of `query` in the document, in document order.
 *
 * The walk is over text nodes, so a match never crosses a mark boundary or an atom, and the
 * positions it reports are document positions a selection can address directly.
 */
export function findMatches(
  state: EditorState,
  query: string,
  mode: SearchMode = 'insensitive',
): SearchMatch[] {
  const needle = mode === 'insensitive' ? query.toLocaleLowerCase() : query;

  if (needle === '') {
    return [];
  }

  const matches: SearchMatch[] = [];
  const doc = state.doc;

  const walk = (node: DocNode, offset: number): void => {
    if (node.isText) {
      const haystack =
        mode === 'insensitive' ? node.textContent.toLocaleLowerCase() : node.textContent;
      let index = haystack.indexOf(needle);

      while (index >= 0) {
        matches.push({ from: offset + index, to: offset + index + needle.length });
        index = haystack.indexOf(needle, index + Math.max(needle.length, 1));
      }

      return;
    }

    let childOffset = offset + 1;

    node.forEach((child) => {
      walk(child, childOffset);
      childOffset += child.nodeSize;
    });
  };

  walk(doc, 0);

  return matches;
}

/** Whether the selection covers content a painter, a find or a replace may touch. */
export function hasRange(state: EditorState): boolean {
  const { empty, from, to } = state.selection;

  return !empty && to > from;
}

/** Heading level of the block at the selection, or `null` when it is not a heading. */
export function headingLevel(state: EditorState): null | number {
  const block = blockAt(state);

  if (!block || block.node.name !== 'heading') {
    return null;
  }

  const level = Number(block.node.attr('level') ?? 1);

  return Number.isFinite(level) ? level : null;
}

/** Indentation level of the block at the selection, `0` when it has none. */
export function indentLevelOf(state: EditorState): number {
  const indent = Number(blockAt(state)?.node.attr('indent') ?? 0);

  return Number.isInteger(indent) && indent > 0 ? indent : 0;
}

/** Whether the whole document is selected. */
export function isAllSelected(state: EditorState): boolean {
  return state.selection instanceof AllSelection;
}

/** Whether the block at the selection is a paragraph. */
export function isParagraph(state: EditorState): boolean {
  return blockAt(state)?.node.name === 'paragraph';
}

/** Line height of the block at the selection, as the picker shows it. */
export function lineHeightOf(state: EditorState): null | number | string {
  const block = blockAt(state);

  return block ? ((block.node.attr('lineHeight') as null | number | string) ?? null) : null;
}

/**
 * Marks carried by the selection, in document order, deduplicated by type.
 *
 * This is what the format painter samples: the first character of the range decides, which is the
 * convention every word processor follows.
 */
export function marksAtSelection(state: EditorState): Mark[] {
  const { empty, from } = state.selection;

  if (empty) {
    return [...(state.doc.resolve(from).nodeBefore()?.markSet ?? [])];
  }

  const node = state.doc.resolve(from + 1 > state.doc.content.size ? from : from + 1).nodeAfter();
  const first = node && node.isText ? node : state.doc.resolve(from).nodeAfter();

  return [...(first?.markSet ?? [])];
}

/** The match at or after the selection, which is where "find next" starts. */
export function nextMatchIndex(matches: readonly SearchMatch[], state: EditorState): number {
  const pos = state.selection.from;

  for (const [index, match] of matches.entries()) {
    if (match.from >= pos) {
      return index;
    }
  }

  return matches.length > 0 ? 0 : -1;
}

/** Text of a node, which for anything but a text node is its descendants' text. */
export function nodeText(node: DocNode): string {
  return node.textContent;
}

/** Serializes the marks of a selection for the painter to hold. */
export function painterFrom(state: EditorState): null | RichTextEditorFormatPainter {
  const block = blockAt(state);
  const marks = marksAtSelection(state);

  if (!block && marks.length === 0) {
    return null;
  }

  return {
    marks: marks.map((mark) => ({ attrs: { ...mark.attrs }, type: mark.type.name })),
    nodeAttrs: painterBlockAttrs(block),
    nodeName: block?.node.name ?? 'paragraph',
  };
}

/** Replaces every match of `query`, reporting how many were replaced. */
export function replaceAll(
  editor: Editor,
  query: string,
  replacement: string,
  mode: SearchMode = 'insensitive',
): ReplaceResult {
  let count = 0;

  for (;;) {
    const match = findMatches(editor.state, query, mode)[0];

    if (!match) {
      return { count };
    }

    if (!replaceMatch(editor, match, replacement)) {
      return { count };
    }

    count += 1;

    if (count > MAX_REPLACEMENTS) {
      return { count };
    }
  }
}

/** Replaces one match with `replacement`, keeping it in the undo history as one edit. */
export function replaceMatch(editor: Editor, match: SearchMatch, replacement: string): boolean {
  return editor.runCommand((state, dispatch) => {
    if (!dispatch) {
      return true;
    }

    const tr = state.tr;

    tr.replaceWith(match.from, match.to, replacement);
    tr.setSelection(TextSelectionClass.create(tr.doc, match.from, match.from + replacement.length));
    tr.setMeta('historyGroup', 'replace');
    dispatch(tr);

    return true;
  });
}

/** The image node selected as a whole, or `null`. */
export function selectedImage(state: EditorState): { attrs: Attrs; pos: number } | null {
  const { selection } = state;

  if (selection instanceof NodeSelection && selection.node.name === 'image') {
    return { attrs: { ...selection.node.attrs }, pos: selection.from };
  }

  return null;
}

/** The plain text of the current selection. */
export function selectedText(state: EditorState): string {
  const { from, to } = state.selection;

  return state.doc.textBetween(from, to, '\n', () => '\n');
}

/** Selects `match`, so the browser scrolls to it and the next command applies to it. */
export function selectMatch(editor: Editor, match: SearchMatch): void {
  const selection = TextSelectionClass.create(editor.state.doc, match.from, match.to);

  editor.runCommand((state, dispatch) => {
    if (!dispatch) {
      return true;
    }

    dispatch(state.tr.setSelection(selection).scrollIntoView());

    return true;
  });
  editor.focus();
}

/**
 * Builds a command that sets one attribute on every block the selection touches.
 *
 * This is the command the engine does not register: `setTextAlign` is a fixed attribute, while line
 * height and paragraph spacing are values a toolbar picks, so the command is built from the value
 * the user chose and run through the editor like any other.
 */
export function setBlockAttributes(attrs: Attrs): Command {
  return (state, dispatch) => {
    if (!dispatch) {
      return true;
    }

    const starts = blockRangeStarts(state);

    if (starts.length === 0) {
      return false;
    }

    const tr = state.tr;

    for (const pos of starts) {
      const node = state.doc.resolve(pos).nodeAfter();

      if (node) {
        tr.setNodeAttrs(pos, node.type, attrs);
      }
    }

    if (!tr.docChanged) {
      return false;
    }

    tr.setMeta('historyGroup', 'block');
    dispatch(tr);

    return true;
  };
}

/**
 * Builds a command that turns the selected blocks into the node named `name`.
 *
 * `setHeading` sets a level on a heading; the toolbar's block picker has to turn *any* block — a
 * paragraph, a quote, a paragraph inside a list item — into a heading and back, which is what this
 * does by naming the type and building the command for the value the user picked.
 */
export function setBlockNodeType(name: string, attrs: Attrs = {}): Command {
  return (state, dispatch) => {
    const type = state.schema.nodes[name];

    return type ? setBlockType(type, attrs)(state, dispatch) : false;
  };
}

/** Spacing of the block at the selection, as the picker shows it. */
export function spacingOf(state: EditorState): {
  marginBottom: null | number | string;
  marginTop: null | number | string;
} {
  const block = blockAt(state);
  const value = (name: string): null | number | string => {
    const attr = block?.node.attr(name);

    return attr === undefined || attr === null || attr === '' ? null : (attr as number | string);
  };

  return { marginBottom: value('marginBottom'), marginTop: value('marginTop') };
}

/** Positions of the opening token of every block the selection touches. */
function blockRangeStarts(state: EditorState): number[] {
  const { from, to } = state.selection;
  const start = blockPosition(state.doc, from);
  const end = blockPosition(state.doc, to);

  if (start === null) {
    return [];
  }

  const last = end ?? start;
  const starts: number[] = [];
  let pos = start;

  while (pos <= last) {
    const node = state.doc.resolve(pos).nodeAfter();

    if (!node) {
      break;
    }

    starts.push(pos);
    pos += node.nodeSize;
  }

  return starts;
}

/**
 * Block attributes worth copying: presentation only.
 *
 * A painter that copied a `link` mark would turn the target into a link, and one that copied a
 * `code_block`'s language would rewrite markup; the attributes below are the ones a user means by
 * "make this look like that".
 */
function painterBlockAttrs(block: BlockEntry | null): Attrs {
  const attrs: Attrs = {};

  if (!block) {
    return attrs;
  }

  for (const name of ['align', 'indent', 'lineHeight', 'marginBottom', 'marginTop'] as const) {
    const value = block.node.attr(name);

    if (value !== undefined && value !== null && value !== '') {
      attrs[name] = value;
    }
  }

  if (block.node.name === 'heading') {
    attrs.level = block.node.attr('level');
  }

  return attrs;
}

/** Ceiling for a replace-all run, so a hostile query cannot spin forever. */
const MAX_REPLACEMENTS = 10_000;

/**
 * A command that inserts `text` at the caret, dropping the marks the next character would carry.
 *
 * "Paste as plain text" is this plus the clipboard read: the text arrives as data and becomes
 * content without the marks, blocks or nodes the clipboard formatted version would bring.
 */
export function insertPlainText(text: string): Command {
  return (state, dispatch) => {
    if (!dispatch) {
      return text !== '';
    }

    const tr = state.tr;

    tr.setStoredMark(null);

    if (state.selection.empty) {
      tr.insert(state.selection.from, state.schema.text(text));
    } else {
      tr.replaceWith(state.selection.from, state.selection.to, text);
    }

    tr.setMeta('historyGroup', 'input');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** Whether the document contains nothing a reader would see. */
export function isEmptyDocument(state: EditorState): boolean {
  return state.doc.textContent.trim() === '' && state.doc.childCount <= 1;
}

/** The node of `name` that `attr` selects at the selection, or `null`. */
export function markOfName(state: EditorState, name: string): Mark | null {
  const type = state.schema.marks[name];

  if (!type) {
    return null;
  }

  const marks = marksAtSelection(state).filter((mark) => mark.type.name === name);

  return marks[0] ?? null;
}

/** Selects the whole document. */
export function selectAllCommand(): Command {
  return selectAll();
}
