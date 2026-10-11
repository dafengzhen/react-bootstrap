import type { Editor } from '../editor.ts';
import type { Fragment } from '../model/fragment.ts';
import type { Schema } from '../schema/schema.ts';
import type { EditorViewOptions } from './editor-view.ts';

import { registerViewModule } from '../editor.ts';
import { parseHTML } from './dom-parser.ts';
import { EditorView } from './editor-view.ts';

/**
 * The DOM half of the editor.
 *
 * The core is headless: it knows nothing about elements, events or the browser's selection. This
 * entry point adds all of that and registers itself with the core, so
 *
 * ```ts
 * import { Editor, StarterKit } from '@dafengzhen/editor';
 *
 * const editor = new Editor({ element: '#editor', extensions: [StarterKit] });
 * ```
 *
 * works while a headless build can import only the core and leave the view out.
 */
export function createEditorView(editor: Editor, options: EditorViewOptions = {}): EditorView {
  return new EditorView(editor, options);
}

registerViewModule({
  createView: (editor, element, options) =>
    new EditorView(editor, { ...options, element: element as EditorViewOptions['element'] }),
  parseHTML: (html: string, schema: Schema): Fragment => parseHTML(html, schema),
});

export { ClipboardManager, serializeRange } from './clipboard.ts';
export type { ClipboardOptions, ClipboardPayload } from './clipboard.ts';
export { CompositionController, showsTextTheDocumentDoesNot } from './composition-controller.ts';
export { CompositionManager, IDLE_COMPOSITION } from './composition.ts';
export type { CompositionState } from './composition.ts';
export { DecorationSet, inlineAttrsAt } from './decoration.ts';
export type { Decoration } from './decoration.ts';
export {
  dragPayload,
  escapeHtml,
  fileMarkup,
  keyEventLike,
  readClipboard,
  resolveElement,
  selectionKey,
  writeClipboard,
} from './dom-helpers.ts';
export type { DragPayload } from './dom-helpers.ts';
export { parseDOMElement, parseHTML, parsePlainText } from './dom-parser.ts';
export { changedRange, mirrorsBlocks } from './dom-reconcile.ts';
export { createViewMaps, renderContent, renderDocumentRoot, renderNode } from './dom-renderer.ts';
export type {
  DOMElement,
  DOMNode,
  DOMText,
  RenderContext,
  TextSegment,
  ViewMaps,
} from './dom-renderer.ts';
export {
  defaultDOMRules,
  mergeDOMRules,
  rulesForSchema,
  styleAttr,
  styleValue,
} from './dom-rules.ts';
export type { DOMAttrs, DOMRules, MarkDOMRule, NodeDOMRule } from './dom-rules.ts';
export { EditorView, replacedBlocks } from './editor-view.ts';
export type { EditorViewOptions } from './editor-view.ts';
export { attachExternalToolbar } from './external-toolbar.ts';
export type { ExternalToolbarAction, ExternalToolbarOptions } from './external-toolbar.ts';
export { blockParser, InputHandler, readDOMChange } from './input.ts';
export { defaultLocale, resolveLocale } from './locale.ts';
export type { EditorLocale, ResolvedEditorLocale } from './locale.ts';
export { createNodeViewControls, nodeViewPosition } from './node-controls.ts';
export { NodeViewHost } from './node-view-host.ts';
export type { NodeView, NodeViewContext, NodeViewFactory, NodeViewRegistry } from './node-view.ts';
export {
  canCreateObjectUrl,
  createUrl as createObjectUrl,
  ObjectUrlRegistry,
  revokeUrl as revokeObjectUrl,
} from './object-url.ts';
export { domAtPos, posAtDom, readSelection, writeSelection } from './position.ts';
export type { DOMPosition } from './position.ts';
export { SelectionController } from './selection-controller.ts';
export { ViewListeners } from './view-listeners.ts';
