import type { NodeRange } from '../model/node-range.ts';
import type { NodeType } from '../model/node-type.ts';
import type { Node as DocNode } from '../model/node.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { Attrs } from '../util/object.ts';
import type { Command } from './command.ts';

import { Fragment } from '../model/fragment.ts';
import { Slice } from '../model/slice.ts';
import { AllSelection } from '../selection/all-selection.ts';
import { TextSelection } from '../selection/text-selection.ts';

/** Commands that change the nature of the block the cursor sits in. */

/** The type of the block that contains the cursor, or `undefined`. */
export function blockAt(state: EditorState, pos: number, offset = 0): DocNode | undefined {
  const doc = state.doc;
  const depth = blockDepthAt(doc, pos);

  if (depth === 0) {
    return undefined;
  }

  const $pos = doc.resolve(pos);
  let target = depth;

  while (target > 0 && offset > 0) {
    target--;
  }

  return $pos.node(target);
}

/** Range covering the blocks the selection touches, at `depth`. */
export function blockRange(state: EditorState, depth: number): NodeRange | null {
  const { from, to } = state.selection;
  const resolved = blockDepthAt(state.doc, from);

  if (resolved === 0) {
    return null;
  }

  return state.doc.resolveRange(from, to, Math.min(depth, resolved));
}

/**
 * Sets the block at the cursor to `type`, keeping its content.
 *
 * Used by `setHeading(2)`, `setParagraph()` and anything else that swaps a block
 * for another one of the same shape.
 */
export function setBlockType(type: NodeType, attrs: Attrs = {}): Command {
  return (state, dispatch) => {
    const { from, to } = state.selection;
    const tr = state.tr;
    const visit = (parent: DocNode, base: number): void => {
      parent.forEach((node, offset) => {
        const pos = base + offset;
        const end = pos + node.nodeSize;

        if (end <= from || pos > to || (!state.selection.empty && pos === to)) {
          return;
        }

        if (!node.isLeaf && node.contentMatch.allowedTypes.some((candidate) => candidate.isText)) {
          if (
            node.type === type &&
            Object.entries(attrs).every(([name, value]) => node.attr(name) === value)
          ) {
            return;
          }
          const replacement = type.create({ ...node.attrs, ...attrs }, node.content);

          tr.replaceWith(pos, end, new Slice(Fragment.from([replacement]), 0, 0));
        } else if (!node.isLeaf) {
          visit(node, pos + 1);
        }
      });
    };

    visit(state.doc, 0);

    if (!tr.docChanged) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    // Textblock type changes preserve size, so retain both endpoints and selection direction.
    tr.setSelection(
      state.selection instanceof AllSelection
        ? new AllSelection(tr.doc)
        : TextSelection.create(tr.doc, state.selection.anchor, state.selection.head),
    );
    tr.setMeta('historyGroup', 'block');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** Turns the block at the cursor into a heading of `level`. */
export function setHeading(level = 1): Command {
  return (state, dispatch) => {
    const type = state.schema.nodes.heading;

    if (!type) {
      return false;
    }

    return setBlockType(type, { level })(state, dispatch);
  };
}

/** Sets one attribute on the block at the cursor. */
export function setNodeAttr(name: string, value: unknown): Command {
  return (state, dispatch) => {
    const { from, to } = state.selection;
    // A cursor inside text resolves to the *text* node, which has no attributes: taking
    // `before($from.depth)` here would address that text node, so the step would be refused and
    // the command would report that it did nothing. The block around the inline content is what
    // is meant, which is why it is looked up by walking out instead.
    const start = enclosingBlockStart(state.doc, from);
    const end = enclosingBlockStart(state.doc, to);

    if (start === null || end === null) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;
    let pos = start;

    // Every block the selection touches gets the attribute, so aligning a multi-paragraph
    // selection works as expected.
    while (pos <= end) {
      const node = state.doc.resolve(pos).nodeAfter();

      if (!node) {
        break;
      }

      tr.setNodeAttrs(pos, node.type, { [name]: value });
      pos += node.nodeSize;
    }

    if (!tr.docChanged) {
      return false;
    }

    tr.setMeta('historyGroup', 'block');
    dispatch(tr);

    return true;
  };
}

/** Turns the block at the cursor back into a paragraph. */
export function setParagraph(): Command {
  return (state, dispatch) => {
    const type = state.schema.nodes.paragraph;

    if (!type) {
      return false;
    }

    return setBlockType(type)(state, dispatch);
  };
}

/** Sets the `align` attribute of the block at the cursor. */
export function setTextAlign(align: 'center' | 'justify' | 'left' | 'right'): Command {
  return setNodeAttr('align', align);
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

/**
 * Position of the opening token of the block containing `pos`, or `null`.
 *
 * "The block containing a position" is the deepest non-text node around it: a position inside
 * text belongs to the textblock that holds the text, and a position at a block boundary belongs
 * to the block that follows it. The returned position is the node's own start, one position
 * before its content, which is the position a `setNodeAttrs` step addresses.
 */
function enclosingBlockStart(doc: DocNode, pos: number): null | number {
  const depth = blockDepthAt(doc, pos);

  return depth === 0 ? null : doc.resolve(pos).before(depth);
}
