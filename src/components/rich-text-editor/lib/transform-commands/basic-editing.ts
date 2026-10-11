import type { Command } from '../command/command.ts';
import type { Fragment } from '../model/fragment.ts';
import type { NodeType } from '../model/node-type.ts';
import type { Node as DocNode } from '../model/node.ts';
import type { Selection } from '../selection/selection.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { Transaction } from '../state/transaction.ts';

import { Fragment as FragmentClass } from '../model/fragment.ts';
import { Slice as SliceClass } from '../model/slice.ts';
import { AllSelection } from '../selection/all-selection.ts';
import { NodeSelection } from '../selection/node-selection.ts';
import { TextSelection } from '../selection/text-selection.ts';

/**
 * Creates an editable paragraph beside a selected or adjacent block atom.
 *
 * A horizontal rule and block media cannot contain a text caret. Browsers represent a click at
 * either edge as a document-level position (and may normalize it to the other edge), so letting
 * their native Enter handling run leaves the DOM selection detached from the model. Claiming the
 * boundary here gives Enter one deterministic result and one valid place for the caret.
 */
export function createParagraphNear(): Command {
  return (state, dispatch) => {
    const { selection } = state;
    const paragraph = state.schema.nodes.paragraph;

    if (!paragraph || !selection.$from.node().contentMatch.allows(paragraph)) {
      return false;
    }

    let boundary: null | number = null;

    if (selection instanceof NodeSelection && selection.node.isBlock) {
      boundary = selection.from === 0 ? selection.from : selection.to;
    } else if (selection.empty && selection.$from.depth === 0) {
      const before = selection.$from.nodeBefore();
      const after = selection.$from.nodeAfter();

      if (after?.isBlock && after.isLeaf) {
        boundary = selection.from;
      } else if (before?.isBlock && before.isLeaf) {
        boundary = selection.from;
      }
    }

    if (boundary === null) {
      return false;
    }

    const block = paragraph.createAndFill();

    if (!block) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr.insert(boundary, block);

    if (!tr.docChanged) {
      return false;
    }

    tr.setSelection(TextSelection.create(tr.doc, boundary + 1));
    tr.setMeta('historyGroup', 'split');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/**
 * Deletes the character before the cursor.
 *
 * This is the part of Backspace that a cursor inside a block needs; at the start of a block there
 * is nothing before the cursor, so the command reports `false` and `joinBackward`, which merges
 * the two blocks, gets its turn.
 */
export function deleteBackward(): Command {
  return (state, dispatch) => {
    const { selection } = state;

    if (!selection.empty) {
      return false;
    }

    const $pos = selection.$from;
    const depth = blockDepth($pos);

    if (depth === 0 || $pos.pos <= $pos.start(depth)) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr.delete($pos.pos - 1, $pos.pos);

    if (!tr.docChanged) {
      return false;
    }

    tr.setSelection(collapse(tr, $pos.pos - 1));
    tr.setMeta('historyGroup', 'delete');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/**
 * Deletes the character after the cursor.
 *
 * The mirror of {@link deleteBackward}: at the end of a block it steps aside for `joinForward`,
 * which merges the block with the next one.
 */
export function deleteForward(): Command {
  return (state, dispatch) => {
    const { selection } = state;

    if (!selection.empty) {
      return false;
    }

    const $pos = selection.$from;
    const depth = blockDepth($pos);

    if (depth === 0) {
      return false;
    }

    const end = $pos.start(depth) + $pos.node(depth).content.size;

    if ($pos.pos >= end) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr.delete($pos.pos, $pos.pos + 1);

    if (!tr.docChanged) {
      return false;
    }

    tr.setSelection(collapse(tr, $pos.pos));
    tr.setMeta('historyGroup', 'delete');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** Deletes the current selection. */
export function deleteSelection(): Command {
  return (state, dispatch) => {
    const { from, to } = state.selection;

    if (from === to) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;

    if (state.selection instanceof AllSelection || (from === 0 && to === state.doc.content.size)) {
      // The schema may require a block in the document. Fill the top node with its
      // minimum valid content, then put the caret in that content.
      const paragraph = state.schema.nodes.paragraph?.createAndFill();
      const empty = state.schema.topNodeType.createAndFill();

      if (!paragraph && !empty) {
        return false;
      }

      tr.replaceWith(from, to, paragraph ?? empty!.content);
      tr.setSelection(TextSelection.near(tr.doc, 0, 1));
    } else {
      tr.delete(from, to);
      tr.setSelection(collapse(tr, from));
    }

    if (!tr.docChanged) {
      return false;
    }
    tr.setMeta('historyGroup', 'delete');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/**
 * Inserts `text` at the current selection.
 *
 * The cursor ends up after the inserted text, whatever the selection was — a keystroke goes in at
 * the caret, which is the end of a range the user selected, and the previous command's selection
 * must not swallow the next character typed into it.
 */
export function insertText(text: string): Command {
  return (state, dispatch) => {
    if (text.length === 0) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr.insertAtCaret(text);

    if (!tr.docChanged) {
      return false;
    }

    tr.setMeta('historyGroup', 'typing');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/**
 * Joins the block before the cursor into the current one.
 *
 * This is what Backspace at the start of a block does: instead of deleting a character it merges
 * the two blocks, which is why the marks and the attributes of both sides survive.
 */
export function joinBackward(): Command {
  return (state, dispatch) => {
    const { selection } = state;

    if (!selection.empty) {
      return deleteSelection()(state, dispatch);
    }

    const $pos = selection.$from;
    const depth = blockDepth($pos);

    if (depth === 0 || $pos.pos > $pos.start(depth)) {
      return false;
    }

    const taskBackspace = liftTaskItemAtStart(state, dispatch);

    if (taskBackspace !== null) {
      return taskBackspace;
    }

    // The boundary between the two blocks is the current block's own start, which is
    // also where the previous block ends — a level above the cursor's own position.
    const boundary = $pos.before(depth);

    if (!state.doc.resolve(boundary).nodeBefore()) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;

    if (tr.canJoin(boundary)) {
      tr.join(boundary);
      // The two boundary tokens are gone, so the junction the caret belongs at sits
      // one position before the second block used to start.
      tr.setSelection(collapse(tr, boundary - 1));
      tr.setMeta('historyGroup', 'delete');
      dispatch(tr.scrollIntoView());

      return true;
    }

    // A browser's native Backspace can mutate an unsupported block boundary into malformed
    // markup. Move to the preceding editable position and keep the model authoritative.
    const previous = TextSelection.near(tr.doc, boundary - 1, -1);

    if (!previous.eq(selection)) {
      dispatch(tr.setSelection(previous).scrollIntoView());
    }

    return true;
  };
}

/**
 * Joins the block after the cursor into the current one.
 *
 * The mirror of {@link joinBackward}: what Delete at the end of a block does.
 */
export function joinForward(): Command {
  return (state, dispatch) => {
    const { selection } = state;

    if (!selection.empty) {
      return deleteSelection()(state, dispatch);
    }

    const $pos = selection.$from;
    const depth = blockDepth($pos);

    if (depth === 0 || $pos.pos < $pos.start(depth) + $pos.node(depth).content.size) {
      return false;
    }

    // One level up again: the current block's own end is the next block's start.
    const boundary = $pos.after(depth);

    if (!state.doc.resolve(boundary).nodeAfter()) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;

    if (!tr.canJoin(boundary)) {
      return false;
    }

    tr.join(boundary);
    tr.setSelection(collapse(tr, $pos.pos));
    tr.setMeta('historyGroup', 'delete');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** Selects the whole document. */
export function selectAll(): Command {
  return (state, dispatch) => {
    if (state.doc.content.size === 0) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    dispatch(state.tr.setSelection(new AllSelection(state.doc)));

    return true;
  };
}

/**
 * Splits the block at the cursor and starts a new one.
 *
 * This is the behaviour behind Enter: a paragraph becomes two paragraphs, a list item becomes a
 * new list item, and a non-collapsed selection is deleted first — exactly what a user expects
 * from each of those states.
 */
export function splitBlock(): Command {
  return (state, dispatch) => {
    const { selection } = state;

    const fromDepth = blockDepth(selection.$from);
    const toDepth = blockDepth(selection.$to);
    if (
      fromDepth > 0 &&
      toDepth > 0 &&
      selection.$from.node(fromDepth).name === 'code_block' &&
      selection.$from.node(fromDepth) === selection.$to.node(toDepth)
    ) {
      if (!dispatch) {
        return true;
      }
      const tr = state.tr.replaceSelectionWith('\n');
      if (!tr.docChanged) {
        return false;
      }
      tr.setMeta('historyGroup', 'typing');
      dispatch(tr.scrollIntoView());
      return true;
    }

    if (!selection.empty) {
      return deleteSelection()(state, dispatch);
    }

    const listSplit = splitListItem(state, dispatch);

    if (listSplit !== null) {
      return listSplit;
    }

    const $pos = selection.$from;
    const depth = blockDepth($pos);

    if (depth === 0) {
      return false;
    }

    const node = $pos.node(depth);

    if (node.isLeaf) {
      return false;
    }

    const content = node.content;
    const offset = $pos.pos - $pos.start(depth);

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;
    const base = $pos.start(depth);
    const beforeContent = content.cut(0, offset);
    const afterContent = content.cut(offset);
    const paragraph = state.schema.nodes.paragraph;
    const parentAllowsParagraph = paragraph
      ? $pos.node(depth - 1).contentMatch.allows(paragraph)
      : false;
    const atStartOfHeading = offset === 0 && node.name === 'heading' && parentAllowsParagraph;
    const atEndOfHeading =
      offset === content.size && node.name === 'heading' && parentAllowsParagraph;
    const before = atStartOfHeading
      ? paragraph?.createAndFill()
      : node.type.create(node.attrs, beforeContent);
    const after = atEndOfHeading
      ? paragraph?.createAndFill()
      : node.type.create(node.attrs, afterContent);

    if (!before || !after) {
      return false;
    }

    const slice = new SliceClass(FragmentClass.from([before, after]), 0, 0);

    // The block is replaced as a whole: one token before its content and one behind it. Two
    // blocks cannot be inserted *inside* a paragraph, but swapping one block for two is exactly
    // what the parent's content model already allows.
    tr.replaceWith(base - 1, base + content.size + 1, slice);
    // At the start of a heading the new paragraph is the line the user asked for, so its caret
    // stays there. Every other split puts it at the start of the second block.
    tr.setSelection(collapse(tr, atStartOfHeading ? base : base + before.nodeSize));
    // A new block ends the typing run, so the split stays its own undo step.
    tr.setMeta('historyGroup', 'split');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** Depth of the deepest non-text node a position resolves to; `0` when it resolves to text. */
function blockDepth($pos: { depth: number; node: (depth: number) => DocNode }): number {
  for (let depth = $pos.depth; depth > 0; depth--) {
    if (!$pos.node(depth).isText) {
      return depth;
    }
  }

  return 0;
}

/** A collapsed selection at `pos` in the transaction's document. */
function collapse(tr: Transaction, pos: number): Selection {
  return TextSelection.create(tr.doc, Math.min(pos, tr.doc.content.size));
}

/** Backspace at the start of a task item removes its checkbox and lifts its blocks. */
function liftTaskItemAtStart(state: EditorState, dispatch: Parameters<Command>[1]): boolean | null {
  const $pos = state.selection.$from;
  let itemDepth = -1;

  for (let depth = $pos.depth - 1; depth > 0; depth--) {
    if ($pos.node(depth).name === 'task_item') {
      itemDepth = depth;
      break;
    }
  }

  if (itemDepth < 1 || $pos.node(itemDepth - 1).name !== 'task_list') {
    return null;
  }

  const paragraphDepth = itemDepth + 1;
  const item = $pos.node(itemDepth);
  const paragraph = $pos.node(paragraphDepth);

  if (
    paragraph?.name !== 'paragraph' ||
    item.child(0) !== paragraph ||
    $pos.pos !== $pos.start(paragraphDepth)
  ) {
    return null;
  }

  if (!dispatch) {
    return true;
  }

  const list = $pos.node(itemDepth - 1);
  const index = $pos.index(itemDepth - 1);
  const start = $pos.before(itemDepth - 1);
  const end = $pos.after(itemDepth - 1);
  const before = list.content.children.slice(0, index);
  const after = list.content.children.slice(index + 1);
  const replacement: DocNode[] = [];

  if (before.length > 0) {
    replacement.push(list.type.create(list.attrs, before));
  }

  replacement.push(...item.content.children);

  if (after.length > 0) {
    replacement.push(list.type.create(list.attrs, after));
  }

  const tr = state.tr.replaceWith(start, end, FragmentClass.from(replacement));

  if (!tr.docChanged) {
    return false;
  }

  const caret = start + (before.length > 0 ? replacement[0]!.nodeSize : 0) + 1;
  tr.setSelection(collapse(tr, caret));
  tr.setMeta('historyGroup', 'delete');
  dispatch(tr.scrollIntoView());

  return true;
}

/** Splits a list item, or exits the list when its only paragraph is empty. */
function splitListItem(state: EditorState, dispatch: Parameters<Command>[1]): boolean | null {
  const $pos = state.selection.$from;
  let itemDepth = -1;

  for (let depth = $pos.depth - 1; depth > 0; depth--) {
    if ($pos.node(depth).name === 'list_item' || $pos.node(depth).name === 'task_item') {
      itemDepth = depth;
      break;
    }
  }

  const paragraphDepth = itemDepth + 1;

  if (
    itemDepth < 1 ||
    ($pos.depth !== paragraphDepth &&
      ($pos.depth !== paragraphDepth + 1 || !$pos.node($pos.depth).isText))
  ) {
    return null;
  }

  const paragraph = $pos.node(paragraphDepth);
  const item = $pos.node(itemDepth);
  const list = $pos.node(itemDepth - 1);

  if (
    paragraph.name !== 'paragraph' ||
    item.child(0) !== paragraph ||
    (list.name !== 'bullet_list' && list.name !== 'ordered_list' && list.name !== 'task_list')
  ) {
    return null;
  }

  if (!dispatch) {
    return true;
  }

  const index = $pos.index(itemDepth - 1);
  const start = $pos.before(itemDepth - 1);
  const end = $pos.after(itemDepth - 1);
  const items = list.content.children;
  const tr = state.tr;
  let caret: number;

  if (paragraph.content.size === 0 && item.childCount === 1) {
    const before = items.slice(0, index);
    const after = items.slice(index + 1);
    const replacement: DocNode[] = [];

    if (before.length > 0) {
      replacement.push(list.type.create(list.attrs, before));
    }

    replacement.push(paragraph.type.create(paragraph.attrs));

    if (after.length > 0) {
      replacement.push(list.type.create(list.attrs, after));
    }

    tr.replaceWith(start, end, FragmentClass.from(replacement));
    caret = start + (before.length > 0 ? replacement[0]!.nodeSize : 0) + 1;
  } else {
    const offset = $pos.pos - $pos.start(paragraphDepth);
    const before = paragraph.type.create(paragraph.attrs, paragraph.content.cut(0, offset));
    const after = paragraph.type.create(paragraph.attrs, paragraph.content.cut(offset));
    const first = item.type.create(item.attrs, [before]);
    const second = item.type.create(
      item.name === 'task_item' ? { ...item.attrs, checked: false } : item.attrs,
      [after, ...item.content.children.slice(1)],
    );
    const replacement = list.type.create(list.attrs, [
      ...items.slice(0, index),
      first,
      second,
      ...items.slice(index + 1),
    ]);

    tr.replaceWith(start, end, replacement);
    caret = start + 1 + list.contentOffsetOf(index) + first.nodeSize + 2;
  }

  if (!tr.docChanged) {
    return false;
  }

  tr.setSelection(collapse(tr, caret));
  tr.setMeta('historyGroup', 'split');
  dispatch(tr.scrollIntoView());

  return true;
}

/** Re-exported so the command modules share one fragment type. */
export type { Fragment, NodeType };
