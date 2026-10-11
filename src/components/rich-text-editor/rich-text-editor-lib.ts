import type { Node } from './lib/model/node.ts';

/**
 * The headless editor, re-exported for the React layer.
 *
 * The engine lives in `lib/` and knows nothing about React: it owns the document model, the
 * commands and the DOM view, and this module is the single place the components import it from.
 * Keeping the import in one file means the component tree never reaches into the engine's internals,
 * and a future engine package can be swapped in by changing this file alone.
 *
 * ```ts
 * import { Editor, MediaKit, StarterKit } from './rich-text-editor-lib.ts';
 * ```
 *
 * The engine's entry point exports values, so the handful of names the components use as types are
 * re-exported here from the modules that declare them rather than restated.
 */
export * from './lib/index.ts';
/** Attributes a DOM rule writes onto an element. */
export type { DOMAttrs, DOMRules } from './lib/view/dom-rules.ts';

/** A document node, under the name this layer uses for it. */
export type DocNode = Node;

/** The view that renders an editor into an element. */
export type { EditorView } from './lib/view/editor-view.ts';

export {
  ClipboardManager,
  createEditorView,
  defaultDOMRules,
  mergeDOMRules,
  rulesForSchema,
} from './lib/view/index.ts';
