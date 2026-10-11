import type { AttrComputer } from '../model/mark-type.ts';
import type { Mark } from '../model/mark.ts';
import type { Node } from '../model/node.ts';
import type { NodeJSON } from '../model/node.ts';
import type { Attrs } from '../util/object.ts';
import type { ValidationError } from './check.ts';
import type { MarkSpec } from './mark-spec.ts';
import type { NodeSpec } from './node-spec.ts';

import { MarkType } from '../model/mark-type.ts';
import { NodeType } from '../model/node-type.ts';
import { ErrorCode, schemaError, serializationError } from '../util/errors.ts';
import { deepEqual } from '../util/object.ts';
import { createAttrComputer, unknownAttrNames } from './attrs.ts';
import { checkDocument, checkNode, describeProblems } from './check.ts';
import { ContentExpression, parseContentExpression } from './content-expression.ts';

/** Full schema declaration. */
export interface SchemaSpec {
  /**
   * Name of the block an empty document starts with. The top node's content model decides what has
   * to be in a document, so a blank editor asks for the cheapest block the model accepts; naming
   * one keeps that choice stable across releases.
   */
  initialBlock?: string;
  marks?: Record<string, MarkSpec>;
  nodes: Record<string, NodeSpec>;
  /** Name of the root node type; defaults to `doc`. */
  topNode?: string;
}

/**
 * The editor's type system, built once from a declaration and immutable afterwards. It owns every
 * {@link NodeType} and {@link MarkType} together with the content models that decide which
 * documents are legal — the reason the transform layer can reject an invalid edit instead of
 * corrupting the document.
 */
export class Schema {
  readonly initialBlock: null | string;

  marks: Readonly<Record<string, MarkType>> = {};

  nodes: Readonly<Record<string, NodeType>> = {};

  topNodeType: NodeType = null as unknown as NodeType;

  /** Block types whose content model accepts the text type. */
  get textblocks(): readonly NodeType[] {
    const text = this.nodes.text!;

    return this.group('block').filter((type) => !type.isLeaf && type.contentMatch.allows(text));
  }

  private readonly nodeGroups: Map<string, NodeType[]>;

  constructor(spec: SchemaSpec) {
    const nodes: Record<string, NodeType> = {};
    const marks: Record<string, MarkType> = {};
    const nodeGroups = new Map<string, NodeType[]>();

    /** The schema under construction, handed to every node type. */
    const self = this as { marks: Readonly<Record<string, MarkType>> };

    const resolveNode = (name: string): NodeType | undefined => nodes[name];
    const resolveNodeGroup = (group: string): readonly NodeType[] => nodeGroups.get(group) ?? [];
    const resolveMarkGroup = (name: string): readonly MarkType[] =>
      name === '_' ? Object.values(marks) : marks[name] ? [marks[name]!] : [];

    // Nodes first, so content expressions can resolve type names; content models follow, once
    // every node type exists.
    for (const [name, nodeSpec] of Object.entries(spec.nodes)) {
      const attrs = nodeSpec.attrs ?? {};
      const type = new NodeType(
        name,
        { ...nodeSpec, name },
        attrs,
        createAttrComputer(attrs),
        ContentExpression.empty,
        self as unknown as Schema,
      );

      nodes[name] = type;

      for (const group of type.groups) {
        const list = nodeGroups.get(group);

        if (list) {
          if (!list.includes(type)) {
            list.push(type);
          }
        } else {
          nodeGroups.set(group, [type]);
        }
      }
    }

    for (const [name, nodeSpec] of Object.entries(spec.nodes)) {
      const type = nodes[name]!;
      const expression = new ContentExpression(
        nodeSpec.content ?? '',
        parseExpression(nodeSpec, name),
        resolveNode,
        resolveNodeGroup,
      );

      // Groups are complete now: unknown group names surface here.
      expression.validate();

      type.contentMatch = expression.startMatch;
      // Convenience content resolves bare strings, so a type must know the schema's text type
      // before it is asked to build a node.
      type.textNodeType = nodes.text!;
    }

    // Marks: attribute specs plus the `excludes` rule for merging; exclusions resolve in a second
    // pass, since a mark may exclude a type declared after it.
    const excludeNames = new Map<string, readonly string[]>();

    for (const [name, markSpec] of Object.entries(spec.marks ?? {})) {
      const attrs = markSpec.attrs ?? {};
      const excludes = normalizeExcludes(markSpec.excludes, name);

      excludeNames.set(name, excludes);
      marks[name] = new MarkType(
        name,
        { ...markSpec, name },
        [],
        attrs,
        createAttrComputer(attrs),
        (a, b) => marksOverlap(a, b, excludes),
      );
    }

    for (const [name, markType] of Object.entries(marks)) {
      const excludes = excludeNames.get(name) ?? [];
      const resolved = [...new Set(excludes.flatMap((excluded) => resolveMarkGroup(excluded)))];

      markType.setExcludes(resolved);
    }

    const topName = spec.topNode ?? 'doc';
    const topNodeType = nodes[topName];

    if (!topNodeType) {
      throw schemaError(ErrorCode.NO_TOP_NODE, `Schema has no top node "${topName}"`, {
        topNode: topName,
      });
    }

    if (!nodes.text) {
      throw schemaError(ErrorCode.NO_TEXT_NODE, 'Schema has no "text" node type');
    }

    this.nodes = Object.freeze(nodes);
    this.marks = Object.freeze(marks);
    this.topNodeType = topNodeType;
    this.nodeGroups = nodeGroups;
    this.initialBlock = spec.initialBlock ?? null;

    if (this.initialBlock && !nodes[this.initialBlock]) {
      throw schemaError(
        ErrorCode.UNKNOWN_NODE_TYPE,
        `Schema names "${this.initialBlock}" as its initial block but declares no such node`,
        { initialBlock: this.initialBlock, nodeType: this.initialBlock },
      );
    }
  }

  /**
   * Returns `node` when it satisfies this schema and throws otherwise. Every document entering from
   * outside passes through here, so a `SchemaError` means the input was built against another
   * schema or never checked — not that an edit was refused, which the transform layer answers with
   * `false`.
   *
   * @throws {SchemaError} when `node` does not satisfy the schema
   */
  assertValid(node: Node): Node {
    const problems = this.check(node);

    if (problems.length > 0) {
      throw schemaError(ErrorCode.DOCUMENT_INVALID, describeProblems(problems), {
        nodeType: node.type.name,
        problems,
      });
    }

    return node;
  }

  /**
   * Every problem `node` has with respect to this schema — the diagnostic counterpart of
   * {@link Schema.assertValid}, reporting instead of throwing, which is what a property test, an
   * import preview or a dev-mode assertion wants.
   *
   * ```ts
   * schema.check(doc).forEach((problem) => console.warn(problem.code, problem.message));
   * ```
   */
  check(node: Node): ValidationError[] {
    return checkDocument(node, this);
  }

  /** Builds and validates a standalone node, without requiring a document root. */
  createNode(json: NodeJSON): Node {
    const node = this.nodeFromJSONUnchecked(json);
    const problems = [...this.checkJSON(json, []), ...checkNode(node, this)];
    if (problems.length > 0) {
      throw schemaError(ErrorCode.DOCUMENT_INVALID, describeProblems(problems), { problems });
    }
    return node;
  }

  /**
   * An empty document of this schema.
   *
   * The content model decides what "empty" means: a root that requires content is filled with the
   * block named by `initialBlock`, or with the cheapest block the model accepts when none is named
   * — so a root holding a list or another container gets content it accepts, and a schema naming
   * its initial block gets the same document every time.
   *
   * @throws {SchemaError} when no content satisfies the schema's top node
   */
  emptyDoc(): Node {
    const preferred = this.initialBlock
      ? this.nodes[this.initialBlock]?.createAndFill()
      : undefined;
    const doc = preferred
      ? this.topNodeType.createAndFill(null, [preferred])
      : this.topNodeType.createAndFill();

    if (!doc) {
      throw schemaError(
        ErrorCode.NO_BLOCK_NODE,
        `No content satisfies the content model of "${this.topNodeType.name}", so an empty document cannot be built`,
        { topNode: this.topNodeType.name },
      );
    }

    return doc;
  }

  /** Node types belonging to `group`, in declaration order. */
  group(name: string): readonly NodeType[] {
    return this.nodeGroups.get(name) ?? [];
  }

  mark(typeOrName: MarkType | string, attrs?: Attrs): Mark {
    const type = typeof typeOrName === 'string' ? this.marks[typeOrName] : typeOrName;

    if (!type) {
      throw schemaError(ErrorCode.UNKNOWN_MARK_TYPE, `Unknown mark type "${String(typeOrName)}"`, {
        markType: typeof typeOrName === 'string' ? typeOrName : typeOrName.name,
      });
    }

    return type.create(attrs);
  }

  /**
   * Creates a node from this schema, checked against it.
   *
   * This is the boundary the model relies on: a node built here satisfies its parent's content
   * expression, carries only declared attributes and uses nothing but this schema's types;
   * transform code that knows its content is valid uses {@link NodeType.createUnchecked}.
   *
   * @throws {SchemaError} when the result would not be a valid node of this schema
   */
  node(
    typeOrName: NodeType | string,
    attrs?: Attrs | null,
    content?: Parameters<NodeType['create']>[1],
  ): Node {
    const type = typeof typeOrName === 'string' ? this.nodes[typeOrName] : typeOrName;

    if (!type) {
      throw schemaError(ErrorCode.UNKNOWN_NODE_TYPE, `Unknown node type "${String(typeOrName)}"`, {
        nodeType: typeof typeOrName === 'string' ? typeOrName : typeOrName.name,
      });
    }

    return type.createChecked(attrs, content);
  }

  /**
   * Deserializes a document (or fragment) from JSON, checked against this schema.
   *
   * JSON is outside data — storage, a host, a test fixture — and may name unknown types, nest them
   * illegally or carry undeclared attributes; all three are refused rather than absorbed, keeping a
   * loaded document as trustworthy as an edited one.
   *
   * Attributes are read from the JSON, not from the tree: normalizing a bag drops the keys the type
   * does not declare, so a tree checked afterwards could not tell such a key was there. The rest is
   * checked on the tree, where the content model and mark rules live, so the two passes cover
   * everything a loaded document can get wrong.
   *
   * @throws {SerializationError} when the JSON names a type the schema does not have
   * @throws {SchemaError} when the result does not satisfy the schema
   */
  nodeFromJSON(json: NodeJSON): Node {
    const node = this.nodeFromJSONUnchecked(json);
    const problems = [...this.checkJSON(json, []), ...this.check(node)];

    if (problems.length > 0) {
      throw schemaError(ErrorCode.DOCUMENT_INVALID, describeProblems(problems), {
        nodeType: node.type.name,
        problems,
      });
    }

    return node;
  }

  text(text: string, marks: readonly Mark[] = []): Node {
    return this.nodes.text!.createChecked(undefined, text, marks);
  }

  toString(): string {
    return `Schema(${Object.keys(this.nodes).join(', ')})`;
  }

  /**
   * Checks a JSON tree against this schema, including the attributes it spells out: a walk over a
   * built tree cannot see an undeclared attribute (building normalizes the bag), and JSON is the
   * one input where the raw bag still exists.
   *
   * Unknown type names are left to the builder this pairs with, surfacing as a
   * `SerializationError`: a name the schema does not have is malformed input, not a document that
   * disagrees with the schema.
   */
  private checkJSON(json: NodeJSON, path: number[]): ValidationError[] {
    const type = this.nodes[json.type];

    if (!type) {
      return [];
    }

    const problems: ValidationError[] = [];

    for (const name of unknownAttrNames(type.attrs, json.attrs)) {
      problems.push({
        code: 'UNKNOWN_ATTRIBUTE',
        details: { attribute: name, nodeType: type.name },
        message: `"${type.name}" does not declare the attribute "${name}"`,
        path,
      });
    }

    for (const [index, child] of (json.content ?? []).entries()) {
      problems.push(...this.checkJSON(child, [...path, index]));
    }

    return problems;
  }

  /**
   * Builds the tree of {@link Schema.nodeFromJSON} without validating it: unknown type names are
   * still refused, because there is no node to build without a type, while everything expressible
   * as a problem of the finished tree — nesting, attributes, marks — is left to the caller's check.
   */
  private nodeFromJSONUnchecked(json: NodeJSON): Node {
    const type = this.nodes[json.type];

    if (!type) {
      throw serializationError(ErrorCode.UNKNOWN_NODE_TYPE, `Unknown node type "${json.type}"`, {
        nodeType: json.type,
      });
    }

    if (type.isText) {
      const marks = (json.marks ?? []).map((mark) => {
        const markType = this.marks[mark.type];

        if (!markType) {
          throw serializationError(
            ErrorCode.UNKNOWN_MARK_TYPE,
            `Unknown mark type "${mark.type}"`,
            { markType: mark.type },
          );
        }

        return markType.create(mark.attrs ?? {});
      });

      return type.createUnchecked(undefined, json.text ?? '', marks);
    }

    const content = (json.content ?? []).map((child) => this.nodeFromJSONUnchecked(child));

    return type.createUnchecked(json.attrs ?? null, content);
  }
}

/**
 * Whether two marks of the same type may live in the same mark set.
 *
 * An `excludes` entry names either the mark type itself (all instances are mutually exclusive) or
 * an attribute name (instances disagreeing there are mutually exclusive) — the rule that lets
 * `font_size` and `text_color` coexist while two `font_size` values cannot.
 */
function marksOverlap(a: Mark, b: Mark, excludes: readonly string[]): boolean {
  if (a.type !== b.type) {
    return false;
  }

  for (const excluded of excludes) {
    if (excluded === a.type.name) {
      return true;
    }

    if (!deepEqual(a.attrs[excluded], b.attrs[excluded])) {
      return false;
    }
  }

  return true;
}

/** Normalizes a mark `excludes` declaration; a mark excludes itself by default. */
function normalizeExcludes(excludes: MarkSpec['excludes'], ownName: string): string[] {
  const list = typeof excludes === 'string' ? [excludes] : (excludes ?? [ownName]);

  return list.map((name) => name.trim()).filter(Boolean);
}

function parseExpression(spec: NodeSpec, name: string): ReturnType<typeof parseContentExpression> {
  try {
    return parseContentExpression(spec.content ?? '');
  } catch (error) {
    throw schemaError(
      ErrorCode.INVALID_CONTENT_EXPRESSION,
      `Invalid content for node "${name}": ${(error as Error).message}`,
      { cause: error, content: spec.content ?? '', nodeType: name },
    );
  }
}

/** Re-exported so callers only need the schema module for type construction. */
export type { AttrComputer };
