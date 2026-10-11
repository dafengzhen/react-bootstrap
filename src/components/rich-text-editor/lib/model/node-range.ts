import type { ResolvedPos } from '../position/resolved-pos.ts';
import type { Node } from './node.ts';

/**
 * A range between two positions at a shared depth.
 *
 * Node ranges describe "from this position up to that one, both inside a `list_item`"
 * for the list, table and blockquote transforms, without any concrete offsets involved.
 */
export class NodeRange {
  /** Resolved start position. */
  readonly $from: ResolvedPos;

  /** Resolved end position. */
  readonly $to: ResolvedPos;

  /** Depth at which both positions share a parent. */
  readonly depth: number;

  /** Document the range belongs to. */
  readonly doc: Node;

  /** Position after the last covered child of `parent`. */
  get end(): number {
    return this.absolutePosition(this.endIndex);
  }

  /** Index right after the last child of `parent` covered by the range. */
  get endIndex(): number {
    const index = this.firstChildStartingAfter(this.$to.pos);

    return Math.max(index, this.startIndex);
  }

  /** Parent node at `depth`. */
  get parent(): Node {
    return this.$from.node(this.depth);
  }

  /** Position before the first covered child of `parent`. */
  get start(): number {
    return this.absolutePosition(this.startIndex);
  }

  /**
   * Index of the first child of `parent` covered by the range.
   *
   * The range is half open: it covers the children that start at or after the
   * start position, so a position inside a child covers that child and a position
   * on a boundary covers the children after it.
   */
  get startIndex(): number {
    return this.firstChildStartingAt(this.$from.pos);
  }

  constructor($from: ResolvedPos, $to: ResolvedPos, depth: number) {
    this.$from = $from;
    this.$to = $to;
    this.depth = depth;
    this.doc = $from.doc;
  }

  /** Absolute position right before child `index` of `parent`. */
  private absolutePosition(index: number): number {
    const parent = this.parent;
    let pos = this.contentStart();

    for (let i = 0; i < index && i < parent.childCount; i++) {
      pos += parent.child(i).nodeSize;
    }

    return pos;
  }

  /** Absolute position of the first position inside `parent`. */
  private contentStart(): number {
    // The document has no opening token; every other node spends one position on it.
    return this.depth === 0 ? 0 : this.$from.path[this.depth]!.start;
  }

  /** First child of `parent` that starts strictly after `pos`. */
  private firstChildStartingAfter(pos: number): number {
    const parent = this.parent;
    let offset = this.absolutePosition(0);

    for (let index = 0; index < parent.childCount; index++) {
      offset += parent.child(index).nodeSize;

      if (offset > pos) {
        return index + 1;
      }
    }

    return parent.childCount;
  }

  /** First child of `parent` that starts at or after `pos`. */
  private firstChildStartingAt(pos: number): number {
    const parent = this.parent;
    let offset = this.absolutePosition(0);

    for (let index = 0; index < parent.childCount; index++) {
      if (offset >= pos) {
        return index;
      }

      offset += parent.child(index).nodeSize;
    }

    return parent.childCount;
  }
}
