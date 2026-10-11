import type { Node } from '../model/node.ts';
import type { EditorView } from './editor-view.ts';

import { deleteNode, moveToNodeEdge, selectNode } from '../command/node-commands.ts';

/** Reusable controls that read the current node size when the user invokes an action. */
export function createNodeViewControls(node: Node, dom: HTMLElement, view: EditorView) {
  const position = () => nodeViewPosition(node, dom, view);
  const run = (action: 'after' | 'before' | 'remove' | 'select') => {
    const pos = position();
    if (pos === null) {
      return false;
    }
    const command =
      action === 'select'
        ? selectNode(pos)
        : action === 'remove'
          ? deleteNode(pos)
          : moveToNodeEdge(pos, action);
    const success = view.editor.runCommand(command);
    if (success) {
      view.focus();
    }
    return success;
  };
  return {
    moveCaret: (after: boolean) => run(after ? 'after' : 'before'),
    position,
    remove: () => run('remove'),
    select: () => run('select'),
  };
}

/** Resolve the opening position of a mounted node view after neighboring edits. */
export function nodeViewPosition(node: Node, dom: HTMLElement, view: EditorView): null | number {
  const pos = view.posAtDOM(dom, 0);
  return pos === null ? null : pos - (node.isLeaf ? 0 : 1);
}
