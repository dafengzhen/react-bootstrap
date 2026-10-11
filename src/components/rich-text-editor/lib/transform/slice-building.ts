import type { Fragment } from '../model/fragment.ts';
import type { Node } from '../model/node.ts';
import type { ResolvedPos } from '../position/resolved-pos.ts';

import { Slice } from '../model/slice.ts';

/** Whether `pos` is the last position inside the block that contains it. */
export function atBlockEnd(doc: Node, pos: number): boolean {
  const $pos = doc.resolve(pos);
  const block = blockAt($pos);

  return !block || pos === $pos.start(block.level) + block.node.content.size;
}

/** Whether `pos` is the first position inside the block that contains it. */
export function atBlockStart(doc: Node, pos: number): boolean {
  const $pos = doc.resolve(pos);
  const block = blockAt($pos);

  return !block || pos === $pos.start(block.level);
}

/**
 * Number of blocks a cut at `pos` starts or ends inside.
 *
 * A cut out of the middle of a paragraph keeps that paragraph in its content, so the slice records
 * it as an open level; inserting the slice back therefore means inserting the text that was inside
 * the paragraph, not a paragraph in a paragraph. Inline content adds no level, because it is never
 * a slice wrapper of its own.
 */
export function openDepth(doc: Node, pos: number): number {
  const $pos = doc.resolve(pos);
  let depth = 0;

  for (let level = 1; level <= $pos.depth; level++) {
    const node = $pos.node(level);

    if (node.isText || node.isLeaf || node.isInline) {
      break;
    }

    const start = $pos.start(level);

    if (pos < start || pos > start + node.content.size) {
      break;
    }

    depth++;
  }

  return depth;
}

/** Open depth at the end of a cut. */
export function openEnd(doc: Node, pos: number): number {
  return openDepth(doc, pos);
}

/**
 * Open depth at the start of a cut.
 *
 * Zero when the cut starts on a block boundary, otherwise one per block the cut starts inside.
 */
export function openStart(doc: Node, pos: number): number {
  return openDepth(doc, pos);
}

/**
 * Builds the slice that restores the content between two positions.
 *
 * The open depth is derived from the position rather than from the tree: a cut that starts on a
 * block boundary is closed at that side, while a cut that starts inside a block is open by one
 * level. That is what makes the inverse of a deletion insert exactly what was removed, at the
 * right nesting level.
 *
 * ```ts
 * // Deleting "ll" from <paragraph>hello</paragraph> produces a slice that is open
 * // by one level, so re-inserting it drops text back into the paragraph.
 * sliceBetween(doc, 2, 4);
 * ```
 */
export function sliceBetween(doc: Node, from: number, to: number): Slice {
  const content = doc.content.cut(from, to);

  return new Slice(content, openStart(doc, from), openEnd(doc, to));
}

/** The deepest non-text node on the path of `$pos`. */
function blockAt($pos: ResolvedPos): { level: number; node: Node } | null {
  for (let level = $pos.depth; level > 0; level--) {
    const node = $pos.node(level);

    if (!node.isText) {
      return { level, node };
    }
  }

  return null;
}

/** Re-exported so callers can build slices without importing the model. */
export type { Fragment };
