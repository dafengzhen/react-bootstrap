import type { Node } from './node.ts';

import { ErrorCode, schemaError } from '../util/errors.ts';
import { Fragment } from './fragment.ts';

/** Serialized form of a slice. */
export interface SliceJSON {
  content: unknown[];
  openEnd: number;
  openStart: number;
}

/**
 * A fragment together with the number of open start/end depths.
 *
 * Open depth records that the slice was cut out of a deeper context: a slice with
 * `openStart = 1` starts inside a block, so pasting it into a paragraph keeps the inline
 * content instead of nesting a paragraph inside a paragraph. This is what makes cross level
 * replace, copy/paste and list moves work.
 */
export class Slice {
  /** Shared empty slice. */
  static get empty(): Slice {
    return EMPTY_SLICE;
  }

  /** The content itself. */
  readonly content: Fragment;

  /** Number of nodes that are open at the end of the slice. */
  readonly openEnd: number;

  /** Number of nodes that are open at the start of the slice. */
  readonly openStart: number;

  /** Offset inside `content` where open content should be inserted. */
  get insertAt(): number {
    if (this.insertionPoint === null) {
      this.insertionPoint = openOffset(this.content, this.openStart, false);
    }

    return this.insertionPoint;
  }

  /** Offset inside `content` where the open end content is inserted. */
  get insertEnd(): number {
    // The end walk reports an offset measured from the start as well, so it can
    // be used as an insertion point without further arithmetic.
    return openOffset(this.content, this.openEnd, true);
  }

  /** Size of the slice content in the flat position space. */
  get size(): number {
    return this.content.size;
  }

  /** Cached offset of the first insertion point, computed lazily. */
  private insertionPoint: null | number = null;

  constructor(content: Fragment = Fragment.empty, openStart = 0, openEnd = 0) {
    this.content = content;
    this.openStart = openStart;
    this.openEnd = openEnd;
  }

  /**
   * The slice that inserts `node` at the position of a whole-document replacement.
   */
  static fromNode(node: Node): Slice {
    return new Slice(Fragment.from([node]), 0, 0);
  }

  /** Concatenates two slices, joining the open ends. */
  append(other: Slice): Slice {
    if (this.size === 0) {
      return other;
    }

    if (other.size === 0) {
      return this;
    }

    const openStart = this.openStart;
    const openEnd = other.openEnd;
    const content = this.content.append(other.content);

    return new Slice(content, openStart, openEnd);
  }

  /** `true` when both slices have equal content and open depths. */
  eq(other: Slice): boolean {
    return (
      this === other ||
      (this.openStart === other.openStart &&
        this.openEnd === other.openEnd &&
        this.content.eq(other.content))
    );
  }

  /** Serializes the slice for clipboard or test fixtures. */
  toJSON(): SliceJSON {
    return {
      content: this.content.toJSON() as unknown[],
      openEnd: this.openEnd,
      openStart: this.openStart,
    };
  }

  toString(): string {
    return `Slice(${this.openStart},${this.openEnd})<${JSON.stringify(this.toJSON().content)}>`;
  }
}

const EMPTY_SLICE = new Slice(Fragment.empty, 0, 0);

/**
 * Position of the cut that is `depth` levels inside `fragment`.
 *
 * `fromEnd` walks in from the closing side; the result is always an offset
 * measured from the start of the slice, so it can be used as an insertion point
 * in the slice's own coordinate space.
 */
function openOffset(fragment: Fragment, depth: number, fromEnd: boolean): number {
  if (depth === 0 || fragment.childCount === 0) {
    // Nothing is open, or there is nothing to walk into: the insertion point is
    // the start or the end of the content.
    return fromEnd ? fragment.size : 0;
  }

  let node = fromEnd ? fragment.child(fragment.childCount - 1) : fragment.child(0);
  let position = fromEnd ? fragment.size - node.nodeSize : 0;

  for (let level = 1; level < depth; level++) {
    if (node.isLeaf) {
      throw schemaError(
        ErrorCode.SLICE_DEPTH_EXCEEDED,
        'Slice open depth exceeds the content depth',
        { depth, nodeType: node.name },
      );
    }

    const inner = fromEnd ? node.content.child(node.content.childCount - 1) : node.content.child(0);

    position += fromEnd ? node.content.size - inner.nodeSize : 1;
    node = inner;
  }

  if (node.isLeaf) {
    throw schemaError(
      ErrorCode.SLICE_DEPTH_EXCEEDED,
      'Slice open depth exceeds the content depth',
      { depth, nodeType: node.name },
    );
  }

  // The cut is where the open content starts, or where it ends when the walk came
  // in from the closing side and the node has content of its own.
  return fromEnd && node.content.size > 0 ? position + 1 + node.content.size : position + 1;
}
