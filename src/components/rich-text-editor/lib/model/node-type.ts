import type { AttrSpec } from '../schema/attrs.ts';
import type { ContentMatch } from '../schema/content-match.ts';
import type { NodeSpec } from '../schema/node-spec.ts';
import type { Schema } from '../schema/schema.ts';
import type { Attrs } from '../util/object.ts';
import type { Fragment } from './fragment.ts';
import type { AttrComputer } from './mark-type.ts';
import type { Mark } from './mark.ts';
import type { Node } from './node.ts';

import { unknownAttrNames } from '../schema/attrs.ts';
import { checkNode, describeProblems } from '../schema/check.ts';
import { ErrorCode, schemaError } from '../util/errors.ts';
import { deepEqual, freezeAttrs, matchesAttrs } from '../util/object.ts';
import { BlockNode } from './block-node.ts';
import { Fragment as FragmentClass } from './fragment.ts';
import { nodeSizeOfStyle, NodeStyle } from './node-size.ts';
import { TextNode } from './text-node.ts';

/** Content that may be passed to `NodeType.create`. */
export type NodeContent = Fragment | Node | null | readonly (Node | string)[] | string | undefined;

/** Name of the one node type that holds characters. */
export const TEXT_NODE_NAME = 'text';

/**
 * The node half of the schema type system: attribute defaults, content model and factory, which
 * keeps `Node` free of schema knowledge. Instances are created by `Schema`, immutable afterwards.
 */
export class NodeType {
  /** Attribute declarations. */
  readonly attrs: Readonly<Record<string, AttrSpec>>;

  /** Content model of this node type; assigned while the schema is built. */
  contentMatch: ContentMatch;

  /** Attribute values applied when a caller omits them. */
  readonly defaultAttrs: Readonly<Attrs>;

  /** Groups this type belongs to, in declaration order. */
  readonly groups: readonly string[];

  readonly name: string;

  readonly owner: Schema;

  readonly spec: NodeSpec;

  /** Sizing style derived from the spec. */
  readonly style: NodeStyle;

  /**
   * The schema's `text` node type, set by `Schema` while it is built: it lets `create` turn a bare
   * string into a text node without schema knowledge in the model.
   *
   * @internal
   */
  textNodeType: NodeType | null = null;

  /** Whether this type is a leaf that is not text (image, horizontal rule). */
  get isAtom(): boolean {
    return this.style === NodeStyle.Leaf;
  }

  /** Whether instances live in block content. */
  get isBlock(): boolean {
    return !this.isInline;
  }

  /**
   * Whether this type lives in inline content: an inline atom (an image, a mention) is a leaf but
   * sits between characters rather than blocks.
   */
  get isInline(): boolean {
    return (
      this.style === NodeStyle.Inline || this.style === NodeStyle.Text || this.spec.inline === true
    );
  }

  /** Whether instances never have content. */
  get isLeaf(): boolean {
    return this.style === NodeStyle.Leaf || this.style === NodeStyle.Text;
  }

  get isText(): boolean {
    return this.style === NodeStyle.Text;
  }

  /** Alias of {@link NodeType.owner}, matching `type.schema` in the design doc. */
  get schema(): Schema {
    return this.owner;
  }

  private readonly compute: AttrComputer;

  constructor(
    name: string,
    spec: NodeSpec,
    attrs: Record<string, AttrSpec>,
    compute: AttrComputer,
    contentMatch: ContentMatch,
    owner: Schema,
  ) {
    this.name = name;
    this.spec = spec;
    this.attrs = attrs;
    this.compute = compute;
    this.contentMatch = contentMatch;
    this.owner = owner;
    this.defaultAttrs = defaultAttrsFor(attrs, compute);
    this.groups = spec.group ? spec.group.split(' ').filter(Boolean) : [];

    if (name === TEXT_NODE_NAME) {
      this.style = NodeStyle.Text;
    } else if (spec.inline) {
      this.style = spec.content === undefined ? NodeStyle.Leaf : NodeStyle.Inline;
    } else {
      this.style = spec.content === undefined ? NodeStyle.Leaf : NodeStyle.Block;
    }
  }

  allowsMarkType(markTypeName: string): boolean {
    const allowed = this.spec.marks;

    if (allowed === undefined || allowed === '_') {
      return true;
    }

    return allowed.split(' ').includes(markTypeName);
  }

  attrsEqual(a: Attrs, b: Attrs): boolean {
    return deepEqual(a, b);
  }

  /** Creates a node of this type unchecked; an alias of {@link NodeType.createUnchecked}. */
  create(attrs?: Attrs | null, content?: NodeContent, marks?: readonly Mark[]): Node {
    return this.createUnchecked(attrs, content, marks);
  }

  /**
   * Creates a node of this type with the smallest valid content, or `null` when no content
   * satisfies the model.
   *
   * Where {@link NodeType.createChecked} rejects, this one fills: a default child per required
   * slot, recursing into a container nothing satisfies alone — the initial document of a schema
   * whose first block is a list or a blockquote.
   *
   * ```ts
   * schema.topNodeType.createAndFill() ?? schema.node('paragraph');
   * ```
   */
  createAndFill(attrs?: Attrs | null, content?: NodeContent, marks?: readonly Mark[]): Node | null {
    const filled = content === undefined ? fillContent(this, new Set()) : undefined;
    const node = this.createUnchecked(attrs, filled ?? content, marks);

    return checkNode(node, this.owner).length === 0 ? node : null;
  }

  /**
   * Creates a node of this type and checks it against the schema: children have to satisfy the
   * content expression, every type has to belong to this schema, every mark has to be allowed where
   * it sits. Attribute bags are checked before they are normalized, so an undeclared key is
   * reported rather than dropped — a caller that spells `widht` should hear about it.
   *
   * @throws {SchemaError} when the result would not be a valid node of this schema
   */
  createChecked(attrs?: Attrs | null, content?: NodeContent, marks?: readonly Mark[]): Node {
    const unknown = unknownAttrNames(this.attrs, attrs);

    if (unknown.length > 0) {
      throw schemaError(
        ErrorCode.UNKNOWN_ATTRIBUTE,
        `"${this.name}" does not declare the attribute "${unknown[0]}"`,
        { attributes: unknown, nodeType: this.name },
      );
    }

    const node = this.createUnchecked(attrs, content, marks);
    const problems = checkNode(node, this.owner);

    if (problems.length > 0) {
      throw schemaError(ErrorCode.DOCUMENT_INVALID, `${this.name}: ${describeProblems(problems)}`, {
        nodeType: this.name,
        problems,
      });
    }

    return node;
  }

  /**
   * Creates a node of this type without checking it against the schema.
   *
   * This is the fast path the transform layer uses: an edit that reached this point was already
   * accepted by the content model, so re-checking the subtree would cost as much as the edit.
   * Anything that lets outside data in — JSON, pasted HTML, a document handed to
   * `EditorState.create` — has to use {@link NodeType.createChecked} or {@link Schema.node}.
   *
   * ```ts
   * paragraph.createUnchecked(null, 'hello'); // the caller guarantees validity
   * ```
   */
  createUnchecked(attrs?: Attrs | null, content?: NodeContent, marks?: readonly Mark[]): Node {
    if (this.isText) {
      return new TextNode(this, typeof content === 'string' ? content : '', marks ?? []);
    }

    return new BlockNode(
      this,
      this.compute(attrs ?? undefined),
      resolveContent(content, this.textNodeType),
    );
  }

  /**
   * The node's own smallest valid content: empty for a leaf or optional content, the filled
   * children otherwise.
   *
   * @internal
   */
  fillOwnContent(): Node[] {
    return fillContent(this, new Set());
  }

  inGroup(group: string): boolean {
    return this.groups.includes(group);
  }

  /** Whether `attrs` matches every entry of `expected`. */
  matchesAttrs(attrs: Attrs, expected: Attrs | null | undefined): boolean {
    return matchesAttrs(attrs, expected);
  }

  nodeSize(contentSize: number, textLength = 0): number {
    return nodeSizeOfStyle(this.style, contentSize, textLength);
  }

  toString(): string {
    return this.name;
  }

  /** Returns a problem when `attrs` violates an attribute spec, else `null`. */
  validateAttrs(attrs: Attrs): null | string {
    for (const [name, spec] of Object.entries(this.attrs)) {
      const value = attrs[name];

      if (value === undefined || value === null) {
        if (spec.required) {
          return `missing required attribute "${name}"`;
        }

        continue;
      }

      if (spec.validate && !spec.validate(value)) {
        return `invalid value for attribute "${name}"`;
      }
    }

    return null;
  }
}

/** Attribute defaults: `default` values plus the compute function. */
export function defaultAttrsFor(attrs: Record<string, AttrSpec>, compute: AttrComputer): Attrs {
  const supplied: Attrs = {};

  for (const [name, spec] of Object.entries(attrs)) {
    if (spec.default !== undefined) {
      supplied[name] = spec.default;
    }
  }

  const result: Attrs = { ...supplied, ...compute(supplied) };

  for (const [name, value] of Object.entries(result)) {
    if (value === undefined || value === null) {
      delete result[name];
    }
  }

  return freezeAttrs(result);
}

/**
 * Turns loose content input into a `Fragment`.
 *
 * @throws {SchemaError} when a string is given and the schema has no `text` node type
 */
export function resolveContent(content: NodeContent, textType?: NodeType | null): Fragment {
  if (content === undefined || content === null) {
    return FragmentClass.empty;
  }

  if (content instanceof FragmentClass) {
    return content;
  }

  if (Array.isArray(content)) {
    return FragmentClass.from(content.map((child) => toNode(child, textType)));
  }

  return FragmentClass.from([toNode(content as Node | string, textType)]);
}

/**
 * Smallest sequence of children that satisfies a content model, walked one fill type at a time.
 *
 * A state whose `validEnd` is already set can stop — but not before the expression's *minimum* is
 * satisfied: `paragraph block*` reports a valid end at the start, because its `block*` tail may be
 * empty while the leading `paragraph` is missing, so an empty result is final only for a model that
 * accepts nothing at all (what `allowsEmpty` answers). Two stops keep the walk finite: no match
 * state is visited twice, and {@link pickFillType} refuses a type that cannot be filled finitely.
 */
function fillContent(type: NodeType, seen: Set<ContentMatch>): Node[] {
  const nodes: Node[] = [];
  let match: ContentMatch = type.contentMatch;

  while ((nodes.length === 0 || !match.validEnd) && !seen.has(match)) {
    seen.add(match);

    const childType = pickFillType(match, type.textNodeType);
    const next = childType ? match.matchType(childType) : null;

    if (!childType || !next) {
      break;
    }

    // Filling a child against a copy of the visited set stops a model that would recurse for ever.
    nodes.push(childType.createUnchecked(null, fillContent(childType, new Set(seen))));
    match = next;
  }

  return nodes;
}

/** Width of the cheapest children a node of `type` can hold, or `-1` when none fit. */
function minimumChildren(type: NodeType, textType: NodeType | null, seen: Set<NodeType>): number {
  let total = 0;
  const visited = new Set<ContentMatch>();
  let match: ContentMatch = type.contentMatch;

  while (!match.validEnd && !visited.has(match)) {
    visited.add(match);

    let best = -1;
    let cheapest: NodeType | null = null;

    for (const candidate of match.allowedTypes) {
      const cost = minimumCost(candidate, textType, false, seen);

      if (cost >= 0 && (best < 0 || cost < best)) {
        best = cost;
        cheapest = candidate;
      }
    }

    const next = cheapest ? match.matchType(cheapest) : null;

    if (best < 0 || !next) {
      return -1;
    }

    total += best;
    match = next;
  }

  return total;
}

/**
 * Size of the smallest content a node of `type` can hold, or `-1` when nothing fits.
 *
 * A leaf is one position wide, a textblock accepting characters one character wide, a container
 * whatever its content costs — the recurrence `findWrapping` uses too, so the two agree about the
 * lightest way to fill a hole. A type reached twice on one path cannot be filled finitely, so it
 * has no cost a caller can use.
 */
function minimumCost(
  type: NodeType,
  textType: NodeType | null,
  first: boolean,
  seen: Set<NodeType>,
): number {
  if (type.isLeaf) {
    return 1;
  }

  if (textType && type.contentMatch.allows(textType)) {
    return 1;
  }

  if (seen.has(type)) {
    return -1;
  }

  // A container that asks for something a caller cannot guess — a language, a checkbox — cannot
  // fill a slot the editor has to fill on its own.
  if (first && Object.values(type.attrs).some((spec) => spec.required)) {
    return -1;
  }

  const children = minimumChildren(type, textType, new Set([...seen, type]));

  return children < 0 ? -1 : 2 + children;
}

/**
 * Type to put into a required slot, preferring the shallowest one that fits.
 *
 * A slot lists its alternatives in declaration order — for the starter kit `blockquote` before
 * `paragraph` — so taking the first would build an empty document out of a blockquote around a list
 * around a list item around a paragraph: valid, but not what a user recognises.
 * The cheapest alternative wins: a textblock holding characters directly, needing no attributes a
 * caller would have to supply, one character wide.
 */
function pickFillType(match: ContentMatch, textType: NodeType | null): NodeType | null {
  let best: { cost: number; type: NodeType } | null = null;

  for (const type of match.allowedTypes) {
    const cost = minimumCost(type, textType, true, new Set());

    if (cost < 0) {
      continue;
    }

    if (!best || cost < best.cost) {
      best = { cost, type };
    }
  }

  return best?.type ?? null;
}

/** Turns one content item into a node, building text nodes for strings. */
function toNode(child: Node | string, textType?: NodeType | null): Node {
  if (typeof child !== 'string') {
    return child;
  }

  if (!textType) {
    throw schemaError(
      ErrorCode.NO_TEXT_NODE,
      'Content contains text but the schema has no "text" node type',
    );
  }

  return new TextNode(textType, child);
}
