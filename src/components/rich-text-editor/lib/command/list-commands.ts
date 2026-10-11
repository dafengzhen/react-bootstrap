import type { NodeType } from '../model/node-type.ts';
import type { Node as DocNode } from '../model/node.ts';
import type { ResolvedPos } from '../position/resolved-pos.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { Transaction } from '../state/transaction.ts';
import type { Command } from './command.ts';

import { Fragment } from '../model/fragment.ts';
import { Slice } from '../model/slice.ts';
import { placeCursor } from '../state/cursor.ts';

/** Commands that move blocks into and out of lists and quotes. */

/** Increases the `indent` attribute of the blocks the selection touches. */
export function indent(): Command {
  return changeIndent(1);
}

/** Inserts a horizontal rule after the block at the cursor. */
export function insertHorizontalRule(): Command {
  return (state, dispatch) => {
    const ruleType = state.schema.nodes.horizontal_rule;

    if (!ruleType) {
      return false;
    }

    const block = blockAt(state.doc, state.selection.from);

    if (!block) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;
    const pos = state.doc.resolve(state.selection.from).after(block.depth);

    tr.insert(pos, ruleType.create());

    if (!tr.docChanged) {
      return false;
    }

    tr.setMeta('historyGroup', 'block');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/**
 * Moves the list items at the cursor back out of their list.
 *
 * What toggling a list twice does. The whole list is swapped for the content of its items, because
 * the replacement has to happen one level *outside* the list: a paragraph cannot go back into one.
 */
export function liftFromList(listType: NodeType, itemType: NodeType): Command {
  return (state, dispatch) => {
    const { from } = state.selection;
    const list = ancestorOf(state.doc, from, [listType.name]);

    if (!list) {
      return false;
    }

    const $pos = state.doc.resolve(from);
    const item = $pos.node(list.depth + 1);

    if (!item || item.type !== itemType) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;
    // The whole list is swapped for the content of its items: a paragraph cannot go back
    // into a list, so the replacement has to happen one level further out.
    const start = $pos.before(list.depth);
    const end = $pos.after(list.depth);
    const content: DocNode[] = [];

    for (const child of list.node.content.children) {
      content.push(...child.content.children);
    }

    tr.replaceWith(start, end, new Slice(Fragment.from(content), 0, 0));

    if (!tr.docChanged) {
      return false;
    }

    // Lifting drops the list and the list item that were in front of the block.
    placeCursor(tr, from - 2);
    tr.setMeta('historyGroup', 'list');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** Moves the content of a wrapper node up one level. */
export function liftOutOf(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  type: NodeType,
): boolean {
  const { from } = state.selection;
  const wrapper = ancestorOf(state.doc, from, [type.name]);

  if (!wrapper) {
    return false;
  }

  if (!dispatch) {
    return true;
  }

  const $pos = state.doc.resolve(from);
  const tr = state.tr;
  const start = $pos.before(wrapper.depth);
  const end = $pos.after(wrapper.depth);

  tr.replaceWith(start, end, new Slice(wrapper.node.content, 0, 0));

  if (!tr.docChanged) {
    return false;
  }

  // The wrapper's opening token is gone, so the caret moves up with its content.
  placeCursor(tr, from - 1);
  tr.setMeta('historyGroup', 'block');
  dispatch(tr.scrollIntoView());

  return true;
}

/** Decreases the `indent` attribute of the blocks the selection touches. */
export function outdent(): Command {
  return changeIndent(-1);
}

/** Toggles a blockquote around the blocks the selection touches. */
export function toggleBlockquote(): Command {
  return (state, dispatch) => {
    const quoteType = state.schema.nodes.blockquote;

    if (!quoteType) {
      return false;
    }

    const { from, to } = state.selection;
    const inside = ancestorOf(state.doc, from, [quoteType.name]);

    if (inside) {
      return liftOutOf(state, dispatch, quoteType);
    }

    const first = blockAt(state.doc, from);
    const last = blockAt(state.doc, to);

    if (!first || !last) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;
    const start = state.doc.resolve(from).before(first.depth);
    const end = state.doc.resolve(to).after(last.depth);
    const content = state.doc.content.cut(start, end);

    tr.replaceWith(
      start,
      end,
      new Slice(Fragment.from([quoteType.create(undefined, content)]), 0, 0),
    );

    if (!tr.docChanged) {
      return false;
    }

    // The blockquote adds one token in front of the wrapped blocks.
    placeCursor(tr, from + 1);
    tr.setMeta('historyGroup', 'block');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** Toggles a bullet list over the selected blocks. */
export function toggleBulletList(): Command {
  return (state, dispatch) => {
    const listType = state.schema.nodes.bullet_list;
    const itemType = state.schema.nodes.list_item;

    if (!listType || !itemType) {
      return false;
    }

    return wrapInList(listType, itemType)(state, dispatch);
  };
}

/** Toggles a code block around the block the selection is in. */
export function toggleCodeBlock(): Command {
  return (state, dispatch) => {
    const codeType = state.schema.nodes.code_block;

    if (!codeType) {
      return false;
    }

    const { from } = state.selection;
    const inside = ancestorOf(state.doc, from, [codeType.name]);

    if (inside) {
      if (!dispatch) {
        return true;
      }

      const tr = state.tr;
      const paragraph = state.schema.nodes.paragraph;
      const start = state.doc.resolve(from).before(inside.depth);
      const node = state.doc.resolve(start).nodeAfter();

      if (!node || !paragraph) {
        return false;
      }

      tr.replaceWith(
        start,
        start + node.nodeSize,
        new Slice(Fragment.from([paragraph.create(undefined, node.content)]), 0, 0),
      );

      if (!tr.docChanged) {
        return false;
      }

      placeCursor(tr, from);
      tr.setMeta('historyGroup', 'block');
      dispatch(tr.scrollIntoView());

      return true;
    }

    const block = blockAt(state.doc, from);

    if (!block) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;
    const start = state.doc.resolve(from).before(block.depth);
    const node = state.doc.resolve(start).nodeAfter();

    if (!node) {
      return false;
    }

    tr.replaceWith(
      start,
      start + node.nodeSize,
      new Slice(Fragment.from([codeType.create(undefined, node.textContent)]), 0, 0),
    );

    if (!tr.docChanged) {
      return false;
    }

    placeCursor(tr, from);
    tr.setMeta('historyGroup', 'block');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** Toggles an ordered list over the selected blocks. */
export function toggleOrderedList(): Command {
  return (state, dispatch) => {
    const listType = state.schema.nodes.ordered_list;
    const itemType = state.schema.nodes.list_item;

    if (!listType || !itemType) {
      return false;
    }

    return wrapInList(listType, itemType)(state, dispatch);
  };
}

/** Toggles a task list over the selected blocks. */
export function toggleTaskList(): Command {
  return (state, dispatch) => {
    const listType = state.schema.nodes.task_list;
    const itemType = state.schema.nodes.task_item;

    return listType && itemType ? wrapInList(listType, itemType)(state, dispatch) : false;
  };
}

/**
 * Toggles the selected top-level blocks in a list of `listType`.
 *
 * A selected item already in that list is lifted, while ordinary blocks and items from the
 * other list type become separate items in one flat list. Unselected neighbours stay in their
 * original lists.
 */
export function wrapInList(listType: NodeType, itemType: NodeType): Command {
  return (state, dispatch) => {
    const { from, to } = state.selection;
    const doc = state.doc;
    const first = Math.min(doc.resolve(from).index(0), doc.childCount - 1);
    const last = Math.min(doc.resolve(Math.max(from, to - 1)).index(0), doc.childCount - 1);

    if (first < 0 || last < first) {
      return false;
    }

    const start = doc.contentOffsetOf(first);
    const end = doc.contentOffsetOf(last) + doc.child(last).nodeSize;
    const selected = doc.content.children.slice(first, last + 1);
    const selectedItem = (itemStart: number, itemEnd: number) =>
      from === to ? from >= itemStart && from < itemEnd : from < itemEnd && to > itemStart;
    const lift = selected.some((node, index) => {
      if (node.type !== listType) {
        return false;
      }

      const nodeStart = doc.contentOffsetOf(first + index);

      return node.content.children.some((item, itemIndex) => {
        const itemStart = nodeStart + 1 + node.contentOffsetOf(itemIndex);
        return selectedItem(itemStart, itemStart + item.nodeSize);
      });
    });

    if (!dispatch) {
      return true;
    }

    const replacement: DocNode[] = [];
    let targetItems: DocNode[] = [];
    let firstChanged: null | number = null;
    const flushTarget = () => {
      if (targetItems.length > 0) {
        replacement.push(listType.create(undefined, targetItems));
        targetItems = [];
      }
    };
    const emit = (node: DocNode) => {
      flushTarget();
      replacement.push(node);
    };

    for (let index = first; index <= last; index++) {
      const node = doc.child(index);
      const nodeStart = doc.contentOffsetOf(index);

      if (
        node.name === 'bullet_list' ||
        node.name === 'ordered_list' ||
        node.name === 'task_list'
      ) {
        let untouched: DocNode[] = [];
        const flushUntouched = () => {
          if (untouched.length > 0) {
            emit(node.type.create(node.attrs, untouched));
            untouched = [];
          }
        };

        for (let itemIndex = 0; itemIndex < node.childCount; itemIndex++) {
          const item = node.child(itemIndex);
          const itemStart = nodeStart + 1 + node.contentOffsetOf(itemIndex);
          const picked = selectedItem(itemStart, itemStart + item.nodeSize);

          if (!picked || (lift && node.type !== listType)) {
            untouched.push(item);
            continue;
          }

          flushUntouched();
          firstChanged ??= replacement.reduce((size, child) => size + child.nodeSize, 0);

          if (lift) {
            for (const block of item.content.children) {
              emit(block);
            }
          } else {
            targetItems.push(
              itemType.create(item.type === itemType ? item.attrs : undefined, item.content),
            );
          }
        }

        flushUntouched();
        continue;
      }

      if (lift) {
        emit(node);
        continue;
      }

      const paragraph = state.schema.nodes.paragraph;
      const blocks =
        node.name === 'paragraph'
          ? [node]
          : paragraph && (node.name === 'heading' || node.name === 'code_block')
            ? [paragraph.create(undefined, node.content)]
            : paragraph
              ? [paragraph.create(), node]
              : null;

      if (!blocks) {
        return false;
      }

      firstChanged ??= replacement.reduce((size, child) => size + child.nodeSize, 0);
      targetItems.push(itemType.create(undefined, blocks));
    }

    flushTarget();

    if (firstChanged === null) {
      return false;
    }

    const tr = state.tr;

    tr.replaceWith(start, end, new Slice(Fragment.from(replacement), 0, 0));

    if (!tr.docChanged) {
      return false;
    }

    const paragraphOffset =
      !lift && from === to && first === last && doc.child(first).name === 'paragraph'
        ? from - start - 1
        : 0;
    placeCursor(tr, start + firstChanged + (lift ? 1 : 3) + paragraphOffset);
    tr.setMeta('historyGroup', 'list');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** Finds the ancestor of the block at `pos` whose type is one of `names`. */
function ancestorOf(
  doc: DocNode,
  pos: number,
  names: readonly string[],
): { depth: number; node: DocNode } | null {
  const depth = blockDepthAt(doc, pos);

  if (depth === 0) {
    return null;
  }

  const $pos = doc.resolve(pos);

  for (let level = depth; level > 0; level--) {
    const node = $pos.node(level);

    if (names.includes(node.name)) {
      return { depth: level, node };
    }
  }

  return null;
}

/** Block node that contains `pos`, together with its depth. */
function blockAt(doc: DocNode, pos: number): { depth: number; node: DocNode } | null {
  const depth = blockDepthAt(doc, pos);

  if (depth === 0) {
    return null;
  }

  return { depth, node: doc.resolve(pos).node(depth) };
}

/** Depth of the deepest non-text node at `pos`. */
function blockDepthAt(doc: DocNode, pos: number): number {
  const $pos = doc.resolve(pos);

  for (let depth = $pos.depth; depth > 0; depth--) {
    if (!$pos.node(depth).isText) {
      return depth;
    }
  }

  return 0;
}

/** Adds `delta` to the `indent` attribute of every selected block. */
function changeIndent(delta: number): Command {
  return (state, dispatch) => {
    const { from, to } = state.selection;
    const first = blockAt(state.doc, from);
    const last = blockAt(state.doc, to);

    if (!first || !last) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;
    const start = state.doc.resolve(from).before(first.depth);
    const end = state.doc.resolve(to).after(last.depth);
    let pos = start;
    let changed = false;

    while (pos < end) {
      const node = state.doc.resolve(pos).nodeAfter();

      if (!node) {
        break;
      }

      if (node.type.attrs.indent) {
        const current = Number(node.attr('indent') ?? 0);
        const next = Math.max(0, current + delta);

        if (next !== current) {
          tr.setNodeAttrs(pos, node.type, { indent: next });
          changed = true;
        }
      }

      pos += node.nodeSize;
    }

    if (!changed) {
      return false;
    }

    tr.setMeta('historyGroup', 'block');
    dispatch(tr);

    return true;
  };
}

/** Re-exported for list related commands in other modules. */
export type { ResolvedPos };
