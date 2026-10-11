import type { Extension } from '../extension/extension.ts';
import type { NodeSpec } from '../schema/node-spec.ts';
import type { DOMRules } from '../view/dom-rules.ts';
import type { NodeViewRegistry } from '../view/node-view.ts';

import { mediaCommands } from '../command/media-commands.ts';
import { upload } from '../plugins/upload.ts';
import { urlPolicy } from '../serialization/sanitize.ts';
import { imageNodeView, mediaBlockNodeView, mediaDOMRules } from '../view/media-rules.ts';

/**
 * The media nodes: image, video, audio and attachment, plus the upload runtime state.
 *
 * The starter kit deliberately leaves media out (design §79), so this extension is added on
 * demand and can be dropped from a build that does not need it:
 *
 * ```ts
 * const editor = new Editor({
 *   extensions: [StarterKit, MediaKit],
 *   upload: { image: myUploader },
 * });
 *
 * editor.commands.insertImage({ src: 'https://example.com/a.png' });
 * editor.commands.uploadAndInsert({ file, kind: 'image' });
 * ```
 *
 * The extension also carries the view half of the nodes — `MediaKit.nodeViews` and
 * `MediaKit.domRules()` — because node views and DOM rules are options of `EditorView` rather than
 * extension hooks:
 *
 * ```ts
 * const view = new EditorView(editor, {
 *   nodeViews: MediaKit.nodeViews,
 *   rules: mergeDOMRules(defaultDOMRules(), MediaKit.domRules()),
 * });
 * ```
 */

/** An inline image, an atom that occupies one position (design §48). */
export const image: NodeSpec = {
  attrs: {
    alt: { default: null },
    height: { default: null },
    src: { compute: safeUrl },
    title: { default: null },
    width: { default: null },
  },
  draggable: true,
  group: 'inline',
  inline: true,
  name: 'image',
  selectable: true,
};

/** A video block: a provider and the URL it came from (design §50). */
export const video: NodeSpec = {
  attrs: {
    height: { default: null },
    id: { default: null },
    poster: { compute: safeUrlOrNull, default: null },
    provider: { default: 'native' },
    url: { compute: safeUrlOrNull, default: null },
    width: { default: null },
  },
  draggable: true,
  group: 'block',
  name: 'video',
  selectable: true,
};

/** An audio block (design §51). */
export const audio: NodeSpec = {
  attrs: {
    mimeType: { default: null },
    src: { compute: safeUrl },
    title: { default: null },
  },
  draggable: true,
  group: 'block',
  name: 'audio',
  selectable: true,
};

/** A downloadable file, kept as stable business data (design §52). */
export const attachment: NodeSpec = {
  attrs: {
    id: { default: null },
    mimeType: { default: null },
    name: {},
    size: { default: null },
    url: { compute: safeUrl },
  },
  draggable: true,
  group: 'block',
  name: 'attachment',
  selectable: true,
};

/**
 * The media extension, including the view contributions it cannot declare as hooks.
 *
 * A node view and a set of DOM rules are options of `EditorView`, so the extension carries them
 * as data: `nodeViews` is the registry a view is given, and `domRules()` the rules to merge over
 * the defaults.
 */
export interface MediaExtension extends Extension {
  /** DOM rules of the media nodes; merge them over `defaultDOMRules()`. */
  domRules: () => Partial<DOMRules>;
  /** Node views of the media nodes, by node name. */
  nodeViews: NodeViewRegistry;
}

/**
 * The media extension.
 *
 * It contributes the four node specs, the insert commands, the upload plugin that keeps runtime
 * status (design §70) and the view half of the nodes. Images are inline atoms and the other three
 * are block atoms, which is what the media rules in `src/view/media-rules.ts` render.
 */
export function mediaExtension(): MediaExtension {
  return {
    addCommands: mediaCommands,
    addNodes: () => mediaNodes(),
    addPlugins: () => [upload()],
    domRules: mediaDOMRules,
    name: 'media',
    nodeViews: { image: imageNodeView, video: mediaBlockNodeView },
  };
}

/** Every media node spec, keyed by name. */
export function mediaNodes(): Record<string, NodeSpec> {
  return {
    attachment,
    audio,
    image,
    video,
  };
}

/**
 * URL an element of this document may point at, as an attribute computer.
 *
 * A media node holds a URL the browser resolves on its own — an `<img src>` is fetched, an
 * `<audio src>` is played, an anchor is followed — so the policy has to hold while the node is
 * built rather than only while the element is rendered. JSON is where that matters: a document
 * loaded from storage, a host application or a test fixture names its own `src`, and no command
 * validated it. A URL the policy refuses drops the attribute, so the node has no source instead of
 * a dangerous one; the media rules then render no `src` and the parser reads none back, which
 * keeps the round trip through HTML in agreement with the document.
 *
 * @see urlPolicy for what is refused and why
 */
function safeUrl(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  const url = urlPolicy.sanitize(String(value));

  return url === '' ? undefined : url;
}

/**
 * {@link safeUrl} for an optional URL attribute.
 *
 * A video may name a provider instead of a source, so "no URL" is a value this attribute has
 * rather than a missing one, and `null` is what it falls back to.
 */
function safeUrlOrNull(value: unknown): unknown {
  if (value === null || value === undefined) {
    return null;
  }

  return safeUrl(value) ?? null;
}

/** The media extension, as a single instance. */
export const MediaKit: MediaExtension = mediaExtension();

/** Re-exported so a caller configures the view from this module alone. */
export { imageNodeView, mediaDOMRules };
