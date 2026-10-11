import type { NodeJSON } from '../model/node.ts';
import type { Transaction } from '../state/transaction.ts';
import type { Attrs } from '../util/object.ts';
import type { Command } from './command.ts';

import { NodeSelection } from '../selection/node-selection.ts';
import { TextSelection } from '../selection/text-selection.ts';
import { deleteSelection } from '../transform-commands/basic-editing.ts';

/** Delete a node, filling a required empty document with editable content. */
export function deleteNode(pos: number): Command {
  return (state, dispatch) => {
    try {
      const node = state.doc.nodeStartingAt(pos);
      if (!node || node.isText || !node.selectable) {
        return false;
      }
      const selected = state.apply(state.tr.setSelection(NodeSelection.create(state.doc, pos)));
      let planned: Transaction | undefined;
      const success = deleteSelection()(selected, (tr) => {
        planned = tr;
      });
      if (!success || !planned || state.schema.check(planned.doc).length > 0) {
        return false;
      }
      dispatch?.(planned);
      return true;
    } catch {
      return false;
    }
  };
}

/** Insert a checked block after the current top-level block, or at an explicit boundary. */
export function insertBlock(content: NodeJSON, pos?: number): Command {
  return (state, dispatch) => {
    try {
      const node = state.schema.createNode(content);
      if (!node.isBlock || node.type === state.schema.topNodeType) {
        return false;
      }
      const index = Math.min(state.selection.$from.index(0) + 1, state.doc.childCount);
      const boundary =
        pos ??
        state.doc.content.children.slice(0, index).reduce((sum, child) => sum + child.nodeSize, 0);
      if (state.doc.resolve(boundary).depth !== 0) {
        return false;
      }
      const tr = state.tr.insert(boundary, node);
      if (!tr.docChanged || state.schema.check(tr.doc).length > 0) {
        return false;
      }
      tr.setSelection(NodeSelection.create(tr.doc, boundary));
      dispatch?.(tr);
      return true;
    } catch {
      return false;
    }
  };
}

/** Place the caret beside a node; create a paragraph when a block has no text neighbor. */
export function moveToNodeEdge(pos: number, side: 'after' | 'before'): Command {
  return (state, dispatch) => {
    try {
      const node = state.doc.nodeStartingAt(pos);
      if (!node || node.isText) {
        return false;
      }
      const after = side === 'after';
      const boundary = pos + (after ? node.nodeSize : 0);
      const tr = state.tr;
      let cursor = boundary;
      if (!node.isInline) {
        const neighbor = after
          ? state.doc.resolve(boundary).nodeAfter()
          : state.doc.resolve(pos).nodeBefore();
        if (neighbor?.name === 'paragraph') {
          cursor = after ? boundary + 1 : pos - 1;
        } else {
          const paragraph = state.schema.nodes.paragraph?.createAndFill();
          if (!paragraph) {
            return false;
          }
          tr.insert(boundary, paragraph);
          if (!tr.docChanged || state.schema.check(tr.doc).length > 0) {
            return false;
          }
          cursor = boundary + 1;
        }
      }
      tr.setSelection(TextSelection.create(tr.doc, cursor));
      dispatch?.(tr);
      return true;
    } catch {
      return false;
    }
  };
}

/** Replace a node at its opening position, preserving surrounding content and undo history. */
export function replaceNode(pos: number, content: NodeJSON): Command {
  return (state, dispatch) => {
    try {
      const node = state.doc.nodeStartingAt(pos);
      if (!node || node.isText) {
        return false;
      }
      const replacement = state.schema.createNode(content);
      if (replacement.eq(node)) {
        return true;
      }
      const tr = state.tr.replaceWith(pos, pos + node.nodeSize, replacement);
      if (!tr.docChanged || state.schema.check(tr.doc).length > 0) {
        return false;
      }
      dispatch?.(tr);
      return true;
    } catch {
      return false;
    }
  };
}

/** Select a node by its opening position. */
export function selectNode(pos: number): Command {
  return (state, dispatch) => {
    const node = state.doc.nodeStartingAt(pos);
    if (!node || node.isText || !node.selectable) {
      return false;
    }
    dispatch?.(state.tr.setSelection(NodeSelection.create(state.doc, pos)));
    return true;
  };
}

/** Merge attributes; schema validation and media URL normalization remain in the core. */
export function updateNode(pos: number, attrs: Attrs): Command {
  return (state, dispatch) => {
    try {
      const node = state.doc.nodeStartingAt(pos);
      if (!node || node.isText) {
        return false;
      }
      const checked = state.schema.createNode({
        ...node.toJSON(),
        attrs: { ...node.attrs, ...attrs },
      });
      if (checked.eq(node)) {
        return true;
      }
      const tr = state.tr.setNodeAttrs(pos, node.type, checked.attrs);
      if (!tr.docChanged || state.schema.check(tr.doc).length > 0) {
        return false;
      }
      dispatch?.(tr);
      return true;
    } catch {
      return false;
    }
  };
}
