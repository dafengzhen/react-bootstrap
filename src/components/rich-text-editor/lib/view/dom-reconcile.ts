import type { Node as DocNode } from '../model/node.ts';
import type { DOMElement } from './dom-types.ts';

/**
 * Which top level blocks a document change actually touched.
 *
 * The view edits the DOM in place rather than rendering the document again, and these three
 * functions are the whole reason that is safe. They work because a document is immutable with
 * structure sharing: an edit rebuilds only the blocks it changed, so "the block is the very same
 * node object" is exactly the set of blocks the DOM already shows correctly. Comparing content
 * would be both slower and wrong — two paragraphs with equal text can still have different marks,
 * and a rebuilt block has to reach the DOM even when nothing about its text moved.
 *
 * ```ts
 * replacedBlocks(before, after);
 * // `{ newFirst: 1, newLast: 1, oldFirst: 1, oldLast: 1 }` for a second-block edit
 * ```
 */

/**
 * The range two documents differ in, in document positions.
 *
 * A narrower question than {@link replacedBlocks}: this says whether anything changed at all and
 * where the change starts and ends, which is what decides whether a render is worth starting. It is
 * not used to choose which blocks to rebuild — a position at a block boundary belongs to both
 * neighbours, so it cannot say which *blocks* differ, and identity sharing can.
 */
export function changedRange(
  before: DocNode,
  after: DocNode,
): { from: number; toNew: number; toOld: number } | null {
  if (before === after) {
    return null;
  }

  let from = 0;
  let toOld = before.content.size;
  let toNew = after.content.size;
  let start = 0;
  let oldEnd = before.childCount - 1;
  let newEnd = after.childCount - 1;

  while (start <= oldEnd && start <= newEnd && before.child(start) === after.child(start)) {
    from += before.child(start).nodeSize;
    start++;
  }

  while (oldEnd >= start && newEnd >= start && before.child(oldEnd) === after.child(newEnd)) {
    toOld -= before.child(oldEnd).nodeSize;
    toNew -= after.child(newEnd).nodeSize;
    oldEnd--;
    newEnd--;
  }

  return { from, toNew, toOld };
}

/**
 * Whether the DOM still holds exactly one element per top level block.
 *
 * The view edits the DOM by block index, which is sound only while the mirror is intact. A node
 * view, an extension or a browser that inserted its own markup can break that, and rendering the
 * whole document again is then both simpler and correct.
 */
export function mirrorsBlocks(doc: DocNode, dom: DOMElement): boolean {
  if (dom.childNodes.length !== doc.childCount) {
    return false;
  }

  for (let index = 0; index < doc.childCount; index++) {
    if (dom.childNodes[index]?.nodeType !== 1) {
      return false;
    }
  }

  return true;
}

/** Path of a DOM node from the document root, as `/2/0/1` style indexes. */
export function pathOf(node: Node | null): string {
  const parts: number[] = [];
  let current: Node | null = node;

  while (current?.parentNode) {
    parts.unshift(Array.prototype.indexOf.call(current.parentNode.childNodes, current) as number);
    current = current.parentNode;
  }

  return parts.join('/');
}

/**
 * Range of top level blocks that have to be rendered again to turn `before` into `after`.
 *
 * Walking in from both ends, the blocks that are still the very same node need no work and
 * everything between them does. Both ranges are empty at the point where a change removed or
 * inserted blocks between two neighbours.
 *
 * @param before - document the DOM was rendered from
 * @param after - document the DOM has to show
 */
export function replacedBlocks(
  before: DocNode,
  after: DocNode,
): { newFirst: number; newLast: number; oldFirst: number; oldLast: number } {
  let prefix = 0;

  while (
    prefix < before.childCount &&
    prefix < after.childCount &&
    before.child(prefix) === after.child(prefix)
  ) {
    prefix++;
  }

  let suffix = 0;

  while (
    suffix < before.childCount - prefix &&
    suffix < after.childCount - prefix &&
    before.child(before.childCount - 1 - suffix) === after.child(after.childCount - 1 - suffix)
  ) {
    suffix++;
  }

  return {
    newFirst: prefix,
    newLast: after.childCount - 1 - suffix,
    oldFirst: prefix,
    oldLast: before.childCount - 1 - suffix,
  };
}
