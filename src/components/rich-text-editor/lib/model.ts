/**
 * `@dafengzhen/editor/model` — the document and the rules that say which documents are legal.
 *
 * The tier is the core's document half on its own: a tree of {@link Node}s, the {@link Mark}s on
 * its text and the {@link Schema} that decides what may appear inside what, with no editor, state
 * machine, command or browser, so it is the tier to take when the document *is* the job —
 * validating what a server received, converting another format, comparing two revisions.
 *
 * ```ts
 * import { Schema, checkDocument, findDiffStart } from '@dafengzhen/editor/model';
 *
 * const schema = new Schema({
 *   nodes: {
 *     doc: { content: 'block+' },
 *     paragraph: { content: 'inline*', group: 'block' },
 *     text: { group: 'inline' },
 *   },
 * });
 *
 * const doc = schema.node('doc', null, [schema.node('paragraph', null, [schema.text('hi')])]);
 *
 * checkDocument(doc, schema); // [] — the document is legal
 * findDiffStart(doc, later); // where two revisions begin to differ
 * ```
 *
 * | Not in this tier | Why, and what to import instead |
 * | --- | --- |
 * | `Transform`, `Step`, `StepMap` | describing a change takes the step vocabulary: `@dafengzhen/editor/transform` |
 * | `Editor`, `EditorState`, commands, plugins | running an editor takes the state machine: `@dafengzhen/editor/core` |
 * | `EditorView`, DOM rules, clipboard | reaching the screen takes `@dafengzhen/editor/view` |
 *
 * One entry point is one runtime: every subpath is bundled on its own, so two subpaths carry two
 * copies of the classes they share and a document built by one is not a document the other's
 * checks recognise. Editing or rendering therefore belongs to `@dafengzhen/editor/core` or
 * `@dafengzhen/editor`, which own both halves.
 *
 * `scripts/check-dist.mjs` fails a build in which this entry exports `Editor`, `EditorView` or
 * anything else from the DOM half, and the file re-exports names one by one rather than writing
 * `export *`, because a published name is a promise made deliberately.
 */

// `Node.resolve` and `Node.resolveRange` delegate to a registry that `src/position/**` fills in
// when it is imported (see `src/position/position.ts`). The other entry points reach positions
// through their own exports, and this tier publishes no position name at all, so the wiring has to
// be imported for the sake of the `Node` class it does publish: without this line, `doc.resolve(1)`
// throws "Position resolver has not been registered" in a bundle that only ever built a document.
import './position/position.ts';

// ---------------------------------------------------------------------------
// Document model — nodes, marks, fragments and slices
// ---------------------------------------------------------------------------

export { BlockNode } from './model/block-node.ts';
export { findDiffStart, Fragment } from './model/fragment.ts';
export { MarkType } from './model/mark-type.ts';
export { isMarkInSet, Mark, markSetEqual, normalizeMarkSet } from './model/mark.ts';
export type { MarkJSON } from './model/mark.ts';
export { NodeRange } from './model/node-range.ts';
export { NODE_CONTAINER_SIZE, NodeStyle } from './model/node-size.ts';
export { NodeType, TEXT_NODE_NAME } from './model/node-type.ts';
export type { NodeContent } from './model/node-type.ts';
export { Node } from './model/node.ts';
export type { NodeJSON } from './model/node.ts';
export { Slice } from './model/slice.ts';
export type { SliceJSON } from './model/slice.ts';
export { isTextNode, TextNode } from './model/text-node.ts';

// ---------------------------------------------------------------------------
// Schema — which documents are legal
// ---------------------------------------------------------------------------

export { createAttrComputer } from './schema/attrs.ts';
export type { AttrSpec, AttrSpecs } from './schema/attrs.ts';
export { checkDocument, checkNode, isValidNode } from './schema/check.ts';
export type { ValidationCode, ValidationError } from './schema/check.ts';
export {
  ContentExpression,
  ContentMatch,
  parseContentExpression,
  quantifierRange,
} from './schema/content-expression.ts';
export type { Quantifier, TermSpec } from './schema/content-expression.ts';
export type { MarkSpec } from './schema/mark-spec.ts';
export type { NodeSpec } from './schema/node-spec.ts';
export { Schema } from './schema/schema.ts';
export type { SchemaSpec } from './schema/schema.ts';
