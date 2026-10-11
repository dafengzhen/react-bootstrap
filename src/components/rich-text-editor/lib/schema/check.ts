import type { MarkType } from '../model/mark-type.ts';
import type { NodeType } from '../model/node-type.ts';
import type { Node } from '../model/node.ts';
import type { Schema } from './schema.ts';

import { Fragment } from '../model/fragment.ts';

/**
 * Schema validity as a value instead of an exception: the schema is the single source of truth for
 * what a document may contain, and this module decides whether a document agrees with it.
 * Everything that lets outside data in — JSON, pasted HTML, an editor initialised with a document —
 * goes through {@link checkDocument} first, so an invalid tree cannot reach `EditorState` and every
 * layer above can assume the schema holds. The walk is iterative, so a deep document cannot
 * overflow the stack, and every problem carries the child index path of the node it was found on.
 *
 * ```ts
 * for (const problem of checkDocument(doc, schema)) console.warn(problem.code, problem.message);
 * ```
 */

export type ValidationCode =
  | 'FOREIGN_MARK_TYPE'
  | 'FOREIGN_NODE_TYPE'
  /** An attribute is present with a value its spec rejects. */
  | 'INVALID_ATTRIBUTE'
  /** A child of a type the parent's content model does not allow there. */
  | 'INVALID_CHILD'
  /** The children do not satisfy the parent's content expression. */
  | 'INVALID_CONTENT'
  /** A mark is applied to a node that does not allow it. */
  | 'INVALID_MARK'
  | 'MISSING_ATTRIBUTE'
  | 'UNKNOWN_ATTRIBUTE'
  | 'WRONG_TOP_NODE';

/**
 * One reason a node or a document does not satisfy its schema. `path` is the child index path from
 * the checked node, so `[0, 2]` is "the third child of the first child"; the checked node has the
 * empty path.
 */
export interface ValidationError {
  /** What kind of problem this is; stable, so a caller can branch on it. */
  code: ValidationCode;
  /** Extra values the message does not spell out. */
  details: Readonly<Record<string, unknown>>;
  /** Human readable explanation. Not part of the API contract. */
  message: string;
  /** Child index path from the checked node to the offending node. */
  path: readonly number[];
}

/**
 * Checks that replacing `[from, to)` of `parent`'s children with `inserted` keeps `parent` valid —
 * the check a transform performs before it rebuilds a node, exposed so a command can ask what the
 * schema would answer while the edit is applied.
 */
export function checkContentReplacement(
  parent: Node,
  from: number,
  to: number,
  inserted: readonly Node[],
): ValidationError[] {
  const insertedFragment = Fragment.from(inserted as readonly Node[]);

  if (parent.type.contentMatch.canReplace(from, to, parent.content, insertedFragment)) {
    return [];
  }

  return [
    {
      code: 'INVALID_CONTENT',
      details: { from, nodeType: parent.type.name, to },
      message: `Content of "${parent.type.name}" does not allow this replacement`,
      path: [],
    },
  ];
}

/**
 * Every problem `doc` has with respect to `schema`: the document's own type is checked against the
 * schema's top node type first — a document built against another schema would otherwise be
 * reported child by child — and the tree is walked after.
 */
export function checkDocument(doc: Node, schema: Schema): ValidationError[] {
  if (doc.type !== schema.topNodeType) {
    return [
      {
        code: 'WRONG_TOP_NODE',
        details: { actual: doc.type.name, expected: schema.topNodeType.name },
        message: `Document is a "${doc.type.name}" but the schema's top node is "${schema.topNodeType.name}"`,
        path: [],
      },
    ];
  }

  return checkNode(doc, schema);
}

/**
 * Every problem `node` has with respect to `schema`. A node belonging to another schema is reported
 * once and not walked further: its types cannot be looked up here, so deeper messages would be
 * noise.
 */
export function checkNode(node: Node, schema: Schema): ValidationError[] {
  const problems: ValidationError[] = [];
  const queue: { node: Node; parent: Node | null; path: number[] }[] = [
    { node, parent: null, path: [] },
  ];

  while (queue.length > 0) {
    const { node: current, parent, path } = queue.pop()!;

    if (current.type.owner !== schema) {
      problems.push({
        code: 'FOREIGN_NODE_TYPE',
        details: { nodeType: current.type.name },
        message: `Node type "${current.type.name}" belongs to another schema`,
        path,
      });

      continue;
    }

    checkAttrs(current.type, current.attrs, path, problems);
    checkMarks(current, parent, path, problems);
    checkContent(current, path, problems, queue);
  }

  return problems;
}

/**
 * Turns validation problems into one message naming the first of them. The full list stays in
 * `details.problems` of the error a caller raises from it, so reporting one does not lose the rest.
 */
export function describeProblems(problems: readonly ValidationError[]): string {
  if (problems.length === 0) {
    return 'document is valid';
  }

  const first = problems[0]!;
  const suffix = problems.length > 1 ? ` (and ${problems.length - 1} more)` : '';

  return `${first.message} at ${formatPath(first.path)}${suffix}`;
}

/** Renders a child index path as the docs write it. */
export function formatPath(path: readonly number[]): string {
  return path.length === 0 ? 'the root' : `/${path.join('/')}`;
}

/** Whether `node` and everything under it satisfies `schema`. */
export function isValidNode(node: Node, schema: Schema): boolean {
  return checkNode(node, schema).length === 0;
}

function checkAttrs(
  type: MarkType | NodeType,
  attrs: Readonly<Record<string, unknown>>,
  path: readonly number[],
  problems: ValidationError[],
): void {
  for (const name of Object.keys(attrs)) {
    if (!(name in type.attrs)) {
      problems.push({
        code: 'UNKNOWN_ATTRIBUTE',
        details: { attribute: name, typeName: type.name },
        message: `"${type.name}" does not declare the attribute "${name}"`,
        path,
      });
    }
  }

  for (const [name, spec] of Object.entries(type.attrs)) {
    const value = attrs[name];

    if (value === undefined || value === null) {
      if (spec.required) {
        problems.push({
          code: 'MISSING_ATTRIBUTE',
          details: { attribute: name, typeName: type.name },
          message: `"${type.name}" requires the attribute "${name}"`,
          path,
        });
      }

      continue;
    }

    if (spec.validate && !spec.validate(value)) {
      problems.push({
        code: 'INVALID_ATTRIBUTE',
        details: { attribute: name, typeName: type.name, value },
        message: `"${name}" of "${type.name}" rejected the value ${String(value)}`,
        path,
      });
    }
  }
}

/** Checks the children of `node` against its content model and queues them for the walk. */
function checkContent(
  node: Node,
  path: readonly number[],
  problems: ValidationError[],
  queue: { node: Node; parent: Node | null; path: number[] }[],
): void {
  const children = node.content.children;

  if (children.length === 0) {
    if (!node.type.contentMatch.validEnd && !node.type.contentMatch.allowsEmpty) {
      problems.push({
        code: 'INVALID_CONTENT',
        details: { nodeType: node.type.name },
        message: `"${node.type.name}" cannot be empty`,
        path,
      });
    }

    return;
  }

  if (node.type.isText) {
    // A text node has no children of its own: reaching here means the tree was built by hand.
    problems.push({
      code: 'INVALID_CHILD',
      details: { nodeType: node.type.name },
      message: 'A text node has children, which the model does not support',
      path,
    });

    return;
  }

  let match = node.type.contentMatch;
  let broken = false;

  for (let index = 0; index < children.length; index++) {
    const child = children[index]!;

    queue.push({ node: child, parent: node, path: [...path, index] });

    if (broken) {
      // One wrong child is what a caller has to fix; reporting every later sibling would bury it.
      continue;
    }

    const next = match.matchType(child.type);

    if (next === null) {
      broken = true;
      problems.push({
        code: 'INVALID_CHILD',
        details: { childType: child.type.name, index, nodeType: node.type.name },
        message: `"${node.type.name}" does not allow a "${child.type.name}" at child ${index}`,
        path,
      });

      continue;
    }

    match = next;
  }

  if (!broken && !match.validEnd) {
    problems.push({
      code: 'INVALID_CONTENT',
      details: { nodeType: node.type.name },
      message: `Children of "${node.type.name}" do not complete its content model`,
      path,
    });
  }
}

/**
 * Checks that every mark a node carries is allowed where it sits: the *textblock* decides, not the
 * text node, because a `text` node holds characters and declares no `marks` of its own, so asking
 * it would always answer "all of them". The rule a schema author writes — `marks: 'bold'` on the
 * heading — is the declaration this check reads, for the block and for the inline content inside
 * it.
 */
function checkMarks(
  node: Node,
  parent: Node | null,
  path: readonly number[],
  problems: ValidationError[],
): void {
  if (!node.type.isInline) {
    return;
  }

  // An inline node answers for itself, a text node answers to the block around it.
  const holder = node.isText ? (parent ?? node) : node;

  for (const mark of node.markSet) {
    if (mark.type !== node.type.schema.marks[mark.type.name]) {
      problems.push({
        code: 'FOREIGN_MARK_TYPE',
        details: { markType: mark.type.name, nodeType: node.type.name },
        message: `Mark type "${mark.type.name}" belongs to another schema`,
        path,
      });

      continue;
    }

    if (!holder.type.allowsMarkType(mark.type.name)) {
      problems.push({
        code: 'INVALID_MARK',
        details: { markType: mark.type.name, nodeType: holder.type.name },
        message: `"${holder.type.name}" does not allow the mark "${mark.type.name}"`,
        path,
      });

      continue;
    }

    checkAttrs(mark.type, mark.attrs, path, problems);
  }
}
