/**
 * `@dafengzhen/editor/view` — the browser runtime.
 *
 * This is the half of the package that needs a document: the {@link EditorView} that renders a
 * document into an element and turns events back into changes, the {@link NodeView} host that
 * lets a feature render its own nodes, the DOM rules that say which element a node or a mark
 * becomes, the clipboard, composition and object-URL managers, decorations, and the position
 * bridge between a DOM position and a document position.
 *
 * It is a tier of its own because the DOM half is what a headless consumer must be able to leave
 * out, and a boundary is only real once it has a name: `@dafengzhen/editor/model`,
 * `@dafengzhen/editor/transform` and `@dafengzhen/editor/core` import none of this, and a build in
 * which one of them exported an `EditorView` fails in `scripts/check-dist.mjs`. The half is also
 * useful on its own to a host that renders an editor — a framework binding, a toolbar — which
 * types against these names and reaches for the parts that stand without an editor in hand.
 *
 * ```ts
 * import { defaultDOMRules, mediaDOMRules, mergeDOMRules } from '@dafengzhen/editor/view';
 *
 * // The rules a view is given: the starter kit's defaults, plus the media nodes.
 * const rules = mergeDOMRules(defaultDOMRules(), mediaDOMRules());
 *
 * rules.nodes.image; // the tag, attributes and parse hook of the image node
 * ```
 *
 * | Export | What a caller reaches for it for |
 * | --- | --- |
 * | `EditorView`, `createEditorView` | rendering an editor into an element, and destroying it again |
 * | `NodeView`, `NodeViewRegistry`, `NodeViewHost` | giving one node its own element and its own updates |
 * | `DOMRules`, `defaultDOMRules`, `mergeDOMRules`, `mediaDOMRules` | deciding what a node or a mark becomes |
 * | `ClipboardManager`, `CompositionManager`, `ObjectUrlRegistry` | taking over one browser concern |
 * | `DecorationSet`, `inlineAttrsAt` | styling a range without changing the document |
 * | `domAtPos`, `posAtDom`, `readSelection`, `writeSelection` | moving between a DOM position and a document position |
 *
 * One entry point is one runtime. An `EditorView` renders an `Editor`, so a host that wants an
 * editor on a page wants `@dafengzhen/editor`, which is this DOM half plus the core in one bundle:
 * every subpath is bundled on its own, so two of them carry two copies of the classes they share,
 * which is why this tier is the DOM half *under its own name* rather than a second way to put an
 * editor on a page.
 *
 * The media *node views* — `imageNodeView` and `mediaDOMRules` — belong here, because a node view
 * and a set of DOM rules are options of `EditorView` rather than extension hooks; the media
 * *extension* declares schema and commands, so `MediaKit` stays in `@dafengzhen/editor`. The editor
 * API is deliberately absent: `Editor`, `EditorState`, the commands, the extensions and the
 * serializers are not re-exported, so this entry cannot be mistaken for the package itself, and
 * `scripts/check-dist.mjs` fails a build in which it exports them.
 */

export * from './view';
// The node views are re-exported from the module that defines them rather than from
// `./extensions/media.ts`, which also re-exports them: going through the extension would pull the
// media commands and the upload plugin — editor API, not view API — into this tier's bundle.
export { imageNodeView, mediaDOMRules } from './view/media-rules.ts';
