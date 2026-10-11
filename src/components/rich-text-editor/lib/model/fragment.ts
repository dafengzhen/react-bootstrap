import type { Node } from './node.ts';

import { arraysEqual } from '../util/array.ts';
import { ErrorCode, schemaError } from '../util/errors.ts';

/**
 * An immutable ordered list of nodes with a cached size.
 *
 * It is the infrastructure behind position arithmetic, replace and slice: `cut`, `append`
 * and `replaceChild` reuse every child that did not change, which is what keeps history
 * and future CRDT layers cheap.
 */
export class Fragment {
  /** Shared empty fragment. */
  static get empty(): Fragment {
    return EMPTY_FRAGMENT;
  }

  /** Child nodes, never mutated after construction. */
  readonly children: readonly Node[];

  /** Total size in the flat position space. */
  readonly size: number;
  /** Number of direct children. */
  get childCount(): number {
    return this.children.length;
  }

  /** Concatenated text of every text node in this fragment. */
  get textContent(): string {
    return this.children.map((child) => child.textContent).join('');
  }

  /**
   * Fragments are created through {@link Fragment.from}.
   *
   * @internal
   */
  constructor(children: readonly Node[], size: number) {
    this.children = children;
    this.size = size;
  }

  /** Creates a fragment from a node list, normalizing adjacent and empty text. */
  static from(children: readonly Node[]): Fragment {
    if (children.length === 0) {
      return Fragment.empty;
    }

    const nodes: Node[] = [];
    let size = 0;

    for (const child of children) {
      // A text node without characters carries nothing, so building a fragment is
      // where it disappears — otherwise a cut could leave an empty text node behind.
      if (child.isText && child.nodeSize === 0) {
        continue;
      }

      const last = nodes[nodes.length - 1];
      const joined = last ? last.join(child) : child;

      if (last && joined !== last) {
        nodes[nodes.length - 1] = joined;
        size += joined.nodeSize - last.nodeSize;
        continue;
      }

      nodes.push(child);
      size += child.nodeSize;
    }

    return nodes.length === 0 ? Fragment.empty : new Fragment(nodes, size);
  }

  /** Returns a new fragment with `other` appended, merging adjacent text runs. */
  append(other: Fragment): Fragment {
    if (other.size === 0) {
      return this;
    }

    if (this.size === 0) {
      return other;
    }

    const last = this.children[this.children.length - 1]!;
    const first = other.children[0]!;
    const joined = last.join(first);

    if (joined === last) {
      return new Fragment([...this.children, ...other.children], this.size + other.size);
    }

    return Fragment.from([...this.children.slice(0, -1), joined, ...other.children.slice(1)]);
  }

  /** Returns the child at `index`; throws when out of range. */
  child(index: number): Node {
    const node = this.children[index];

    if (!node) {
      throw schemaError(ErrorCode.NO_SUCH_CHILD, `No child at index ${index}`, {
        childCount: this.childCount,
        index,
      });
    }

    return node;
  }

  /** Extracts `[from, to)` as a new fragment, splitting partially covered children. */
  cut(from: number, to: number = this.size): Fragment {
    const start = Math.max(0, Math.min(from, this.size));
    const end = Math.max(start, Math.min(to, this.size));

    if (start === 0 && end === this.size) {
      return this;
    }

    if (start >= end) {
      return Fragment.empty;
    }

    let index = 0;
    let offset = 0;

    while (index < this.childCount && offset + this.children[index]!.nodeSize <= start) {
      offset += this.children[index]!.nodeSize;
      index++;
    }

    if (index >= this.childCount) {
      return Fragment.empty;
    }

    const child = this.children[index]!;
    const childEnd = offset + child.nodeSize;
    const parts: Node[] = [cutStart(child, start - offset, Math.min(end, childEnd) - offset)];

    let pos = childEnd;

    for (index++; index < this.childCount && pos < end; index++) {
      const next = this.children[index]!;
      const nextEnd = pos + next.nodeSize;

      if (nextEnd <= end) {
        parts.push(next);
      } else {
        parts.push(cutStart(next, 0, end - pos));
      }

      pos = nextEnd;
    }

    return Fragment.from(parts);
  }

  /**
   * Children `[index, endIndex)`, with the first one trimmed at `offset` when given.
   *
   * Used by {@link Node.cutByIndex}, where the caller addresses whole children.
   *
   * @internal
   */
  cutByIndex(index: number, endIndex: number, offset = 0): Fragment {
    if (index >= endIndex || index >= this.children.length) {
      return Fragment.empty;
    }

    if (offset === 0 && index === 0 && endIndex === this.children.length) {
      return this;
    }

    const head = offset === 0 ? this.children[index]! : this.children[index]!.cut(offset);
    const rest = this.children.slice(index + 1, endIndex);

    return Fragment.from([head, ...rest]);
  }

  /** `true` when the fragments hold structurally equal children. */
  eq(other: Fragment): boolean {
    if (this === other) {
      return true;
    }

    if (this.size !== other.size) {
      return false;
    }

    return arraysEqual(this.children, other.children, (a, b) => a.eq(b));
  }

  /** Iterates over every child, passing each one its content offset and index. */
  forEach(f: (node: Node, offset: number, index: number) => void): void {
    let offset = 0;

    this.children.forEach((node, index) => {
      f(node, offset, index);
      offset += node.nodeSize;
    });
  }

  /** Index of `node` in this fragment, or `-1`. */
  indexOf(node: Node): number {
    return this.children.indexOf(node);
  }

  /** Returns the child at `index`, or `undefined` when out of range. */
  maybeChild(index: number): Node | undefined {
    return this.children[index];
  }

  /** Prepends a single node, dropping one that carries nothing. */
  prepend(node: Node): Fragment {
    return node.nodeSize === 0 ? this : Fragment.from([node, ...this.children]);
  }

  /** Replaces the child at `index`, keeping the same total size. */
  replaceChild(index: number, node: Node): Fragment {
    const current = this.children[index];

    if (!current) {
      throw schemaError(ErrorCode.NO_SUCH_CHILD, `No child at index ${index}`, {
        childCount: this.childCount,
        index,
      });
    }

    if (current.nodeSize !== node.nodeSize) {
      throw schemaError(
        ErrorCode.REPLACEMENT_SIZE_MISMATCH,
        'Replacement child must have the same size',
        { actual: node.nodeSize, expected: current.nodeSize },
      );
    }

    const children = this.children.slice();
    children[index] = node;

    return new Fragment(children, this.size);
  }

  /**
   * Tail of the fragment from child `index`, keeping `keep` units of it.
   *
   * @internal
   */
  tailFrom(index: number, keep: number): Fragment {
    const head = this.children[index]!.cut(0, keep);
    const rest = this.children.slice(index + 1);

    return Fragment.from([head, ...rest]);
  }

  /** Serializes to a plain array of child JSON values. */
  toJSON(): unknown[] {
    return this.children.map((child) => child.toJSON());
  }
}

const EMPTY_FRAGMENT = new Fragment([], 0);

/** Offset of the first difference between two fragments, or `null` when equal. */
export function findDiffStart(a: Fragment, b: Fragment, pos = 0): null | number {
  let aIndex = 0;
  let bIndex = 0;
  let aOffset = 0;
  let bOffset = 0;

  while (aOffset < a.size && bOffset < b.size) {
    const aChild = a.children[aIndex]!;
    const bChild = b.children[bIndex]!;

    if (aChild === bChild) {
      aOffset += aChild.nodeSize;
      bOffset += bChild.nodeSize;
      aIndex++;
      bIndex++;
      continue;
    }

    if (!aChild.sameMarkup(bChild)) {
      return pos + Math.min(aOffset, bOffset);
    }

    const inner = findDiffStart(aChild.content, bChild.content, pos + aOffset + 1);

    if (inner !== null) {
      return inner;
    }

    aOffset += aChild.nodeSize;
    bOffset += bChild.nodeSize;
    aIndex++;
    bIndex++;
  }

  if (aOffset < a.size || bOffset < b.size) {
    return pos + Math.min(aOffset, bOffset);
  }

  return null;
}

/** Sums the sizes of `children[index, endIndex)`. */
export function sumSizes(children: readonly Node[], index: number, endIndex: number): number {
  let size = 0;

  for (let i = index; i < endIndex; i++) {
    size += children[i]!.nodeSize;
  }

  return size;
}

/**
 * Cuts `[from, to)` out of a child, as offsets of the fragment that holds it.
 *
 * A container spends one offset on its own opening token, so its content starts one unit
 * later; a leaf's offsets are its characters, or its single atom token.
 */
function cutStart(node: Node, from: number, to: number): Node {
  if (node.isLeaf) {
    return from <= 0 && to >= node.nodeSize ? node : node.cut(from, to);
  }

  return node.cut(Math.max(0, from - 1), to - 1);
}
