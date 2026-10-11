import type { ResolvedPos } from '../position/resolved-pos.ts';
import type { Attrs } from '../util/object.ts';
import type { Fragment } from './fragment.ts';
import type { Mark } from './mark.ts';
import type { NodeRange } from './node-range.ts';
import type { NodeType } from './node-type.ts';

import { ErrorCode, invariantError } from '../util/errors.ts';
import { Fragment as FragmentClass } from './fragment.ts';

/** Shared empty mark list, so non-text nodes never allocate one. */
export const EMPTY_MARKS: readonly Mark[] = Object.freeze([]);

/** Serialized form of a node. */
export interface NodeJSON {
  attrs?: Attrs;
  content?: NodeJSON[];
  marks?: { attrs?: Attrs; type: string }[];
  text?: string;
  type: string;
}

/**
 * Resolves a position against this node's document.
 *
 * @internal
 */
export type PositionResolver = (doc: Node, pos: number) => ResolvedPos;

/**
 * Resolves a range against this node's document.
 *
 * @internal
 */
export type RangeResolver = (doc: Node, from: number, to: number, depth: number) => NodeRange;

let resolvePosition: PositionResolver = () => {
  throw invariantError(
    ErrorCode.POSITION_MODULE_MISSING,
    'Position resolver has not been registered',
  );
};

let resolveRange: RangeResolver = () => {
  throw invariantError(ErrorCode.RANGE_MODULE_MISSING, 'Range resolver has not been registered');
};

/**
 * Immutable document node: the structure of the document — `doc`, `paragraph`, `heading`,
 * `bullet_list`, `list_item`, `image`, ... — while character formatting lives in {@link Mark}.
 * Every mutation returns a new tree with structural sharing, which keeps `EditorState` snapshots
 * and history entries cheap.
 *
 * ```ts
 * const doc = schema.nodes.doc.create(undefined, [schema.nodes.paragraph.create(undefined, 'Hello')]);
 * ```
 */
export abstract class Node {
  /** Frozen attribute bag. */
  readonly attrs: Readonly<Attrs>;

  readonly content: Fragment;

  readonly type: NodeType;

  get childCount(): number {
    return this.content.childCount;
  }

  /** Content model of this node, taken from its type. */
  get contentMatch() {
    return this.type.contentMatch;
  }

  /** Whether the node participates in drag & drop. */
  get draggable(): boolean {
    return this.type.spec.draggable === true;
  }

  /** First child, or `undefined`. */
  get firstChild(): Node | undefined {
    return this.content.maybeChild(0);
  }

  /** Whether the node is an atom (a leaf that is not text). */
  get isAtom(): boolean {
    return this.isLeaf && !this.isText;
  }

  /** Whether the node lives in block content, with or without content of its own. */
  get isBlock(): boolean {
    return !this.isInline && !this.isText;
  }

  /** Whether the node is part of the `block` group. */
  get isBlockGroup(): boolean {
    return this.type.inGroup('block');
  }

  /** Whether this node marks the start of a `defining` context (list, blockquote). */
  get isDefining(): boolean {
    return this.type.spec.defining === true;
  }

  abstract get isInline(): boolean;

  /** Whether the node is part of the `inline` group. */
  get isInlineGroup(): boolean {
    return this.type.inGroup('inline');
  }

  /** Whether this node isolates its content from the outside (table cell). */
  get isIsolating(): boolean {
    return this.type.spec.isolating === true;
  }

  abstract get isLeaf(): boolean;

  abstract get isText(): boolean;

  /** Last child, or `undefined`. */
  get lastChild(): Node | undefined {
    return this.content.maybeChild(this.content.childCount - 1);
  }

  /** Marks carried by this node. Only text nodes ever return anything. */
  get markSet(): readonly Mark[] {
    return EMPTY_MARKS;
  }

  get name(): string {
    return this.type.name;
  }

  /** Size of this node in the flat position space. */
  get nodeSize(): number {
    return this.type.nodeSize(this.content.size, this.textLength);
  }

  /** Raw text of this node. Only text nodes ever return a non-empty string. */
  get rawText(): string {
    return '';
  }

  /** Whether the node may be selected as a unit. */
  get selectable(): boolean {
    return this.type.spec.selectable !== false;
  }

  /** Concatenated text of this node and all descendants. */
  get textContent(): string {
    return this.textBetween(0, this.content.size);
  }

  /** Length of the text of this node when it is a text node, else `0`. */
  protected get textLength(): number {
    return 0;
  }

  protected constructor(type: NodeType, attrs: Attrs, content: Fragment) {
    this.type = type;
    this.attrs = attrs;
    this.content = content;
  }

  /** Attribute accessor with the schema default applied. */
  attr(name: string): unknown {
    const value = this.attrs[name];
    return value === undefined ? this.type.defaultAttrs[name] : value;
  }

  /** Child at `index`; throws when out of range. */
  child(index: number): Node {
    return this.content.child(index);
  }

  /** Child that contains offset `pos` of this node's content, if any. */
  childAt(pos: number): { index: number; node: Node; offset: number } | undefined {
    let offset = 0;

    for (let index = 0; index < this.content.childCount; index++) {
      const node = this.content.child(index);

      if (offset < pos && offset + node.nodeSize > pos) {
        return { index, node, offset };
      }

      offset += node.nodeSize;
    }

    return undefined;
  }

  /** Last child that starts strictly before offset `pos` of this node's content. */
  childBefore(pos: number): { index: number; node: Node; offset: number } | undefined {
    let offset = 0;
    let found: { index: number; node: Node; offset: number } | undefined;

    for (let index = 0; index < this.content.childCount; index++) {
      const node = this.content.child(index);

      if (offset >= pos) {
        break;
      }

      found = { index, node, offset };
      offset += node.nodeSize;
    }

    return found;
  }

  /** Child whose content starts exactly at offset `pos`, if any. */
  childStartingAt(pos: number): { index: number; node: Node; offset: number } | undefined {
    let offset = 0;

    for (let index = 0; index < this.content.childCount; index++) {
      if (offset === pos) {
        return { index, node: this.content.child(index), offset };
      }

      if (offset > pos) {
        break;
      }

      offset += this.content.child(index).nodeSize;
    }

    return undefined;
  }

  contentOffsetOf(index: number): number {
    let offset = 0;

    for (let i = 0; i < index && i < this.content.childCount; i++) {
      offset += this.content.child(i).nodeSize;
    }

    return offset;
  }

  copy(content: Fragment = this.content): Node {
    if (content === this.content) {
      return this;
    }

    return this.type.create(this.attrs, content);
  }

  cut(from: number, to: number = this.content.size): Node {
    if (from === 0 && to === this.content.size) {
      return this;
    }

    return this.copy(this.content.cut(from, to));
  }

  /** Copies this node with its children `[index, endIndex)`, the first trimmed at `offset`. */
  cutByIndex(index: number, endIndex: number, offset = 0): Node {
    return this.copy(this.content.cutByIndex(index, endIndex, offset));
  }

  /** Whether this node and `other` are deeply equal. */
  eq(other: Node | null | undefined): boolean {
    if (!other) {
      return false;
    }

    return this === other || (this.sameMarkup(other) && this.content.eq(other.content));
  }

  forEach(f: (node: Node, offset: number, index: number) => void): void {
    this.content.forEach(f);
  }

  /**
   * Merges `other` into this node when they are adjacent and mergeable: text nodes concatenate
   * equal-markup runs, every other node returns itself, which tells `Fragment.append` to keep both
   * children.
   */
  join(_other: Node): Node {
    return this;
  }

  /** Child at `index`, or `undefined`. */
  maybeChild(index: number): Node | undefined {
    return this.content.maybeChild(index);
  }

  /** Descendant whose opening token starts at `pos`, or `undefined`. */
  nodeStartingAt(pos: number): Node | undefined {
    if (pos < 0 || pos > this.content.size) {
      return undefined;
    }

    const direct = this.childStartingAt(pos);

    if (direct) {
      return direct.node;
    }

    for (let index = 0; index < this.childCount; index++) {
      const child = this.child(index);
      const start = this.contentOffsetOf(index);

      if (!child.isLeaf && pos > start && pos < start + child.nodeSize) {
        return child.nodeStartingAt(pos - start - 1);
      }
    }

    return undefined;
  }

  /** Replaces `[from, to)` in this node's content with `content`. */
  replace(from: number, to: number, content: Fragment): Node {
    return this.copy(this.content.cut(0, from).append(content).append(this.content.cut(to)));
  }

  /** Replaces the children `[from, to)` — indices, not offsets — with `content`. */
  replaceChildRange(from: number, to: number, content: Fragment): Node {
    const children = [
      ...this.content.children.slice(0, from),
      ...content.children,
      ...this.content.children.slice(to),
    ];

    return this.copy(FragmentClass.from(children));
  }

  /**
   * Replaces the child starting at the absolute position `pos`, or returns `this` when nothing
   * starts there. Attribute changes do not move positions, so `pos` stays valid across them and can
   * be used to find the node again.
   */
  replaceNodeAt(pos: number, node: Node): Node {
    if (pos < 0 || pos > this.content.size) {
      return this;
    }

    return replaceDescendant(this, pos, node);
  }

  /** Resolves a position in this node's own coordinate space. */
  resolve(pos: number): ResolvedPos {
    return resolvePosition(this, pos);
  }

  /** Resolves a range in this node's own coordinate space. */
  resolveRange(from: number, to: number, depth = 0): NodeRange {
    return resolveRange(this, from, to, depth);
  }

  /** Whether this node and `other` share type and attributes. */
  sameMarkup(other: Node): boolean {
    if (this === other) {
      return true;
    }

    return (
      this.type === other.type &&
      Object.keys(this.attrs).length === Object.keys(other.attrs).length &&
      this.type.attrsEqual(this.attrs, other.attrs)
    );
  }

  /**
   * Text between two offsets inside this node's content.
   *
   * Children tile the content: a child at offset `o` occupies `[o, o + nodeSize)`, and a
   * text node's characters are that range itself. A container spends one token on its own
   * opening boundary, so its content starts one unit later and the offsets shift by one on
   * the way in.
   *
   * @param from - start position, relative to this node's content
   * @param to - end position, relative to this node's content
   * @param blockSeparator - inserted between blocks when given
   * @param leafText - text used for non-text leaves
   */
  textBetween(
    from: number,
    to: number,
    blockSeparator?: string,
    leafText?: (node: Node) => string,
  ): string {
    const parts: string[] = [];
    let offset = 0;

    for (const node of this.content.children) {
      const start = offset;
      const end = start + node.nodeSize;

      offset = end;

      if (start >= to || end <= from) {
        continue;
      }

      if (node.isText) {
        const text = node.rawText;
        const innerStart = Math.max(0, from - start);
        const innerEnd = Math.min(text.length, to - start);
        parts.push(text.slice(innerStart, innerEnd));
        continue;
      }

      if (node.isLeaf) {
        if (start >= from && end <= to) {
          parts.push(leafText ? leafText(node) : '\ufffc');
        }

        continue;
      }

      const innerStart = Math.max(0, from - start - 1);
      const innerEnd = Math.min(node.content.size, to - start - 1);
      const inner = node.textBetween(innerStart, innerEnd, blockSeparator, leafText);

      // Every block the range covers contributes, even an empty one: dropping it would merge the
      // text around it — `<p>one</p><p></p>` is two lines, not one, and a new paragraph must
      // survive a copy.
      if (blockSeparator && parts.length > 0) {
        parts.push(blockSeparator);
      }

      parts.push(inner);
    }

    return parts.join('');
  }

  abstract toJSON(): NodeJSON;

  toString(): string {
    return `<${this.name}${JSON.stringify(this.attrs)}>`;
  }

  withAttrs(attrs: Attrs): Node {
    return this.type.create({ ...this.attrs, ...attrs }, this.content);
  }

  withContent(content: Fragment): Node {
    return this.copy(content);
  }
}

/**
 * Wires the position module into the model without a runtime cycle.
 *
 * @internal
 */
export function registerPositionResolver(position: PositionResolver): void {
  resolvePosition = position;
}

/**
 * Wires the node range resolver into the model without a runtime cycle.
 *
 * @internal
 */
export function registerRangeResolver(range: RangeResolver): void {
  resolveRange = range;
}

/** Replaces the descendant that starts at `pos`, rebuilding only the path to it. */
function replaceDescendant(root: Node, pos: number, node: Node): Node {
  const direct = root.childStartingAt(pos);

  if (direct) {
    return root.replaceChildRange(direct.index, direct.index + 1, FragmentClass.from([node]));
  }

  for (let index = 0; index < root.childCount; index++) {
    const child = root.child(index);
    const start = root.contentOffsetOf(index);
    const end = start + child.nodeSize;

    if (pos <= start || pos >= end || child.isLeaf) {
      continue;
    }

    const inner = replaceDescendant(child, pos - start - 1, node);

    if (inner !== child) {
      return root.replaceChildRange(index, index + 1, FragmentClass.from([inner]));
    }
  }

  return root;
}
