import type { Node } from '../model/node.ts';

import { ErrorCode, schemaError } from '../util/errors.ts';

/** One step of the path from the document root down to a position. */
export interface ResolvedPathEntry {
  /** Index of the child that was followed inside `node`. */
  readonly index: number;
  /**
   * Whether the position sits inside a leaf's own content: a leaf spends its tokens on its own
   * characters, so a position inside one is a character offset, not a child boundary.
   */
  readonly inner?: boolean;
  /** Node at this level. */
  readonly node: Node;
  /**
   * Absolute position of the first content position of `node`; a non-leaf node owns the token in
   * front of its content, so it starts at `start - 1`, while an `inner` leaf starts at the leaf.
   */
  readonly start: number;
}

/**
 * A position resolved against a document.
 *
 * Positions are not DOM offsets but indices into the flat token sequence a document expands to —
 * a paragraph spends one token on each side of its inline content, a text node spends its tokens
 * on its characters — so a resolved position knows its offset and the exact path it sits in.
 *
 * ```ts
 * // <doc><paragraph>ab</paragraph><paragraph>cd</paragraph></doc>
 * doc.resolve(3).parentOffset()  // 1 — after "a" in the first paragraph
 * ```
 */
export class ResolvedPos {
  /** Document the position was resolved against. */
  readonly doc: Node;

  /**
   * Ancestors from the root down to the innermost node, each with its node, followed child and
   * start.
   */
  readonly path: readonly ResolvedPathEntry[];

  /** The position itself. */
  readonly pos: number;

  /** Depth of the innermost node, counted from the document root. */
  get depth(): number {
    return this.path.length - 1;
  }

  /** Whether this position sits inside a leaf rather than on a boundary. */
  get insideLeaf(): boolean {
    return this.path[this.depth]!.inner === true;
  }

  /** The node this position sits in. */
  get parent(): Node {
    return this.path[this.depth]!.node;
  }

  constructor(doc: Node, pos: number, path: readonly ResolvedPathEntry[]) {
    this.doc = doc;
    this.pos = pos;
    this.path = path;
  }

  /**
   * Position directly after the node at `depth`: a non-leaf owns the token behind its content, so
   * its end is one unit past the content end, while a leaf's span ends where its content does.
   */
  after(depth?: number): number {
    const resolved = this.resolveDepth(depth);

    if (resolved === 0) {
      return this.doc.content.size;
    }

    const entry = this.path[resolved]!;

    return entry.inner
      ? entry.start + entry.node.nodeSize
      : entry.start + entry.node.content.size + 1;
  }

  /**
   * Position directly before the node at `depth`: a non-leaf owns the token in front of its
   * content, so this is one unit before its content start; the document and leaves have none.
   */
  before(depth?: number): number {
    const resolved = this.resolveDepth(depth);
    const entry = this.path[resolved]!;

    return resolved === 0 || entry.inner ? entry.start : entry.start - 1;
  }

  /** Position right after the content of the node at `depth`. */
  end(depth?: number): number {
    const entry = this.path[this.resolveDepth(depth)]!;

    return entry.inner ? entry.start + entry.node.nodeSize : entry.start + entry.node.content.size;
  }

  /** Index of the child that contains `pos` inside the node at `depth`. */
  index(depth?: number): number {
    return this.path[this.resolveDepth(depth)]!.index;
  }

  /** Index right after the child that contains `pos`, inside the node at `depth`. */
  indexAfter(depth?: number): number {
    const resolved = this.resolveDepth(depth);
    const entry = this.path[resolved]!;

    if (entry.inner) {
      // The position sits inside the leaf itself, so the leaf is the child before it.
      return entry.index + 1;
    }

    const childStart = entry.start + entry.node.contentOffsetOf(entry.index);
    const child = entry.node.maybeChild(entry.index);
    const insideChild = !!child && this.pos > childStart && this.pos < childStart + child.nodeSize;

    return insideChild ? entry.index + 1 : entry.index;
  }

  /** Node at `depth`; negative values count from the innermost node. */
  node(depth?: number): Node {
    return this.path[this.resolveDepth(depth)]!.node;
  }

  /** Node directly after this position inside its parent, if any. */
  nodeAfter(): Node | undefined {
    const entry = this.path[this.depth]!;

    if (entry.inner) {
      return entry.node;
    }

    return entry.node.childStartingAt(this.parentOffset())?.node;
  }

  /** Node directly before this position inside its parent, if any. */
  nodeBefore(): Node | undefined {
    const entry = this.path[this.depth]!;

    if (entry.inner) {
      // A position inside text has that text before it.
      return entry.node;
    }

    return entry.node.childBefore(this.parentOffset())?.node;
  }

  /** Offset of `pos` inside the content of the node at `depth`. */
  parentOffset(depth?: number): number {
    return this.pos - this.start(depth);
  }

  /** Position before child `index` of the node at `depth`. */
  posAtIndex(index: number, depth?: number): number {
    const entry = this.path[this.resolveDepth(depth)]!;

    return entry.inner ? entry.start : entry.start + entry.node.contentOffsetOf(index);
  }

  /** Whether this position and `other` sit at the same inner offset of a shared parent. */
  sameParent(other: ResolvedPos): boolean {
    return this.pos - this.parentOffset() === other.pos - other.parentOffset();
  }

  /** First position inside the content of the node at `depth`. */
  start(depth?: number): number {
    return this.path[this.resolveDepth(depth)]!.start;
  }

  toString(): string {
    return `ResolvedPos(${this.pos})`;
  }

  /** Clamps a depth into `[0, depth]`. */
  private resolveDepth(depth?: number): number {
    if (depth === undefined) {
      return this.depth;
    }

    const clamped = depth < 0 ? this.depth + depth : depth;

    if (clamped < 0 || clamped > this.depth) {
      throw schemaError(
        ErrorCode.DEPTH_OUT_OF_RANGE,
        `No node at depth ${depth} (document depth is ${this.depth})`,
        { depth, documentDepth: this.depth },
      );
    }

    return clamped;
  }
}

/**
 * Resolves `pos` against `doc`.
 *
 * A position inside a leaf resolves to the leaf itself and reports its offset through
 * `parentOffset()`, so every position is resolvable and no caller has to special case text.
 *
 * ```ts
 * // <doc><paragraph>hello</paragraph></doc>
 * doc.resolve(3).parentOffset()  // 2 — between the second and third character
 * ```
 */
export function resolvePosition(doc: Node, pos: number): ResolvedPos {
  if (pos < 0 || pos > doc.content.size) {
    throw schemaError(
      ErrorCode.POSITION_OUT_OF_RANGE,
      `Position ${pos} is out of range (0..${doc.content.size})`,
      { documentSize: doc.content.size, position: pos },
    );
  }

  const path: ResolvedPathEntry[] = [];
  let node = doc;
  let index = 0;
  let contentStart = 0;

  for (;;) {
    const child = node.maybeChild(index);
    const childStart = contentStart + node.contentOffsetOf(index);
    const childEnd = child ? childStart + child.nodeSize : childStart;

    if (pos <= childStart) {
      // On or before the child's opening boundary: the position sits in front of child `index`.
      path.push({ index, node, start: contentStart });
      return new ResolvedPos(doc, pos, path);
    }

    if (pos < childEnd) {
      if (!child) {
        throw schemaError(
          ErrorCode.POSITION_OUT_OF_RANGE,
          `Position ${pos} is out of range inside "${node.name}"`,
          { nodeType: node.name, position: pos },
        );
      }

      if (child.isLeaf) {
        // The leaf gets its own entry below its parent's, so `depth` walks the real chain.
        path.push({ index, node, start: contentStart });
        path.push({ index, inner: true, node: child, start: childStart });
        return new ResolvedPos(doc, pos, path);
      }

      path.push({ index, node, start: contentStart });
      node = child;
      index = 0;
      contentStart = childStart + 1;
      continue;
    }

    // At or past this child's end, so it belongs to a later sibling — or to the content end.
    index++;
  }
}
