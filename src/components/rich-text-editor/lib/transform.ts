/**
 * `@dafengzhen/editor/transform` — the vocabulary of a change.
 *
 * A change has two halves and this tier names both. A {@link Step} describes one edit in a form
 * that outlives the editor: it carries the range and the content or mark, reports where positions
 * moved, inverts itself and serializes, which is what makes undo, collaboration and a stored edit
 * log possible at all. A {@link Transform} is the engine around steps — it applies them in order
 * and keeps both the document that comes out and the mapping of everything applied. Underneath both
 * sits the position algebra, `StepMap`, `Mapping` and `invertMap`, which answers "where did
 * position 12 go, and how do I get back".
 *
 * ```ts
 * import { StepMap, invertMap } from '@dafengzhen/editor/transform';
 *
 * const inserted = StepMap.offset(5); // five characters went in
 *
 * inserted.map(12); // 17 — where position 12 ended up
 * invertMap(inserted).map(17); // 12 — and where it came from
 * ```
 *
 * | Export | What a caller reaches for it for |
 * | --- | --- |
 * | `Transform` | applying a sequence of edits, and keeping the document and the mapping |
 * | `Step`, `ReplaceStep`, `AddMarkStep`, `RemoveMarkStep`, `AttrStep` | describing, serializing and inverting one edit |
 * | `StepMap`, `Mapping`, `invertMap` | answering "where did position 12 go?" and "how do I undo that?" |
 * | `replaceStep`, `contentAsSlice`, `sliceBetween`, `textSlice`, `applyMark` | building the step a caller actually needs |
 * | `StepResult`, `StepFailure` | learning why an edit was refused instead of catching a throw |
 *
 * One entry point is one runtime, and that is what decides where a change is *applied*. Every
 * subpath is bundled on its own, so two subpaths carry two copies of the classes they share: a
 * document built by `@dafengzhen/editor/model` is not a document this bundle's `Fragment` and
 * `Slice` checks recognise, and handing one to a `Transform` here yields a malformed tree instead
 * of an error at the call site. Applying a change therefore belongs to the entry point that owns
 * both halves — `@dafengzhen/editor/core`, or `@dafengzhen/editor` — while this tier is the change
 * as data: the position algebra, and the steps a caller builds, stores, inverts and maps.
 *
 * | Not in this tier | Why, and what to import instead |
 * | --- | --- |
 * | `Node`, `Slice`, `Fragment`, `Schema` | they describe what a document *is*: `@dafengzhen/editor/model` for the document on its own, `@dafengzhen/editor/core` to edit one |
 * | `Transaction` | it is a `Transform` that also carries a selection, metadata and plugin state, which only means something next to an `EditorState`: `@dafengzhen/editor/core` |
 * | `EditorView`, DOM rules, clipboard | a change is not a rendering: `@dafengzhen/editor/view` |
 *
 * `scripts/check-dist.mjs` fails a build in which this entry exports the editor, the model or the
 * DOM.
 */

// ---------------------------------------------------------------------------
// Transform — how a change is described and applied
// ---------------------------------------------------------------------------

export { invertMap, Mapping } from './transform/mapping.ts';
export { applyMark } from './transform/mark-apply.ts';
export { contentAsSlice, replaceStep } from './transform/replace.ts';
export type { ReplaceContent, ReplaceResult } from './transform/replace.ts';
export { sliceBetween } from './transform/slice-building.ts';
export { StepMap } from './transform/step-map.ts';
export type { MapResult } from './transform/step-map.ts';
export { StepResult } from './transform/step-result.ts';
export type { StepFailure } from './transform/step-result.ts';
export {
  AddMarkStep,
  AttrStep,
  RemoveMarkStep,
  ReplaceStep,
  Step,
  textSlice,
} from './transform/step.ts';
export type { StepJSON } from './transform/step.ts';
export { Transform } from './transform/transform.ts';
