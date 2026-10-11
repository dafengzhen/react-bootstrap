import type { Node as DocNode } from '../model/node.ts';
import type { DOMRules, NodeDOMRule } from './dom-rules.ts';
import type { DOMElement } from './dom-types.ts';
import type { NodeView, NodeViewContext, NodeViewFactory } from './node-view.ts';

import {
  FRAME_ALLOW,
  frameReferrerPolicy,
  frameSandbox,
  frameUrl,
  videoFrameUrl,
} from '../serialization/media-frame.ts';
import { urlPolicy } from '../serialization/sanitize.ts';
import { applyAttrs } from './dom-renderer.ts';

/**
 * The view half of the media nodes.
 *
 * The core has no DOM (design §77), so the media extension contributes the schema and the commands,
 * and a caller hands these rules to the view: `defaultDOMRules()` covers the starter kit,
 * `mediaDOMRules()` adds `image`, `video`, `audio` and `attachment`.
 *
 * ```ts
 * const view = new EditorView(editor, {
 *   nodeViews: MediaKit.nodeViews,
 *   rules: mergeDOMRules(defaultDOMRules(), mediaDOMRules()),
 * });
 * ```
 *
 * Every URL read back from the DOM goes through `urlPolicy`, so a pasted `<img>` with a
 * `javascript:` source is refused instead of becoming a document node. Media reads the same policy
 * as every other URL: a `data:` URL carrying media is accepted, one carrying a document, SVG
 * included, is not.
 */

/**
 * DOM rules of the media nodes.
 *
 * The result only describes the media nodes and marks: `unknown` is left to the rules these are
 * merged over, so the caller keeps deciding what happens to elements no rule claims.
 */
export function mediaDOMRules(): Partial<DOMRules> {
  const nodes: Record<string, NodeDOMRule> = {
    attachment: {
      attrs: (node) => ({
        class: 'rt-attachment',
        'data-id': stringAttr(node, 'id'),
        'data-mime-type': stringAttr(node, 'mimeType'),
        'data-name': stringAttr(node, 'name'),
        'data-size': numberAttr(node, 'size'),
        download: true,
        href: urlAttr(node, 'url'),
      }),
      parse: (element) => {
        const name = element.getAttribute('data-name');
        const url = parseUrl(element, 'href');

        // Only an anchor that carries a name is an attachment; every other `<a>` stays the link
        // mark it was, which is why a plain link is not claimed here.
        if (name === null || url === null || url === undefined) {
          return null;
        }

        return {
          id: element.getAttribute('data-id'),
          mimeType: element.getAttribute('data-mime-type'),
          name,
          size: numberAttribute(element, 'data-size'),
          url,
        };
      },
      tag: 'a',
    },
    audio: {
      attrs: (node) => ({
        controls: true,
        'data-mime-type': stringAttr(node, 'mimeType'),
        src: urlAttr(node, 'src'),
        title: stringAttr(node, 'title'),
      }),
      parse: (element) => {
        const src = parseUrl(element, 'src');

        if (src === null || src === undefined) {
          return null;
        }

        return {
          mimeType: element.getAttribute('data-mime-type'),
          src,
          title: element.getAttribute('title'),
        };
      },
      tag: 'audio',
    },
    embed: {
      attrs: (node) => ({ 'data-embed-url': frameUrl(node.attr('url')), 'data-node': 'embed' }),
      parse: (element) =>
        element.getAttribute('data-node') === 'embed'
          ? {
              height: numberAttribute(element, 'data-embed-height'),
              html: element.getAttribute('data-embed-html'),
              id: element.getAttribute('data-embed-id'),
              provider: element.getAttribute('data-provider') ?? 'iframe',
              title: element.getAttribute('data-embed-title'),
              url: frameUrl(element.getAttribute('data-embed-url')),
              width: numberAttribute(element, 'data-embed-width'),
            }
          : null,
      tag: 'div',
    },
    image: {
      attrs: (node) => ({
        alt: stringAttr(node, 'alt'),
        height: numberAttr(node, 'height'),
        src: urlAttr(node, 'src'),
        title: stringAttr(node, 'title'),
        width: numberAttr(node, 'width'),
      }),
      parse: (element) => {
        const src = parseUrl(element, 'src');

        // An image without a source, or with one the sanitizer rejects, is not content the document
        // can hold.
        if (src === null || src === undefined) {
          return null;
        }

        return {
          alt: element.getAttribute('alt'),
          height: numberAttribute(element, 'height'),
          src,
          title: element.getAttribute('title'),
          width: numberAttribute(element, 'width'),
        };
      },
      tag: 'img',
    },
    video: {
      attrs: (node) => ({
        controls: true,
        'data-id': stringAttr(node, 'id'),
        'data-provider': stringAttr(node, 'provider') ?? 'native',
        height: numberAttr(node, 'height'),
        poster: urlAttr(node, 'poster'),
        src: urlAttr(node, 'url'),
        width: numberAttr(node, 'width'),
      }),
      parse: (element) => {
        if (
          element.tagName.toLowerCase() === 'div' &&
          element.getAttribute('data-node') !== 'video'
        ) {
          return null;
        }
        const wrapped = element.tagName.toLowerCase() === 'div';
        const url = parseUrl(element, wrapped ? 'data-video-url' : 'src');

        // A provider video carries no source of its own, so only a source that is there and unsafe
        // rejects the element.
        if (url === null) {
          return null;
        }

        return {
          height: numberAttribute(element, wrapped ? 'data-height' : 'height'),
          id: element.getAttribute('data-id'),
          poster: parseUrl(element, wrapped ? 'data-video-poster' : 'poster') ?? null,
          provider: element.getAttribute('data-provider') ?? 'native',
          url: url ?? null,
          width: numberAttribute(element, wrapped ? 'data-width' : 'width'),
        };
      },
      parseTags: ['video', 'div'],
      tag: 'video',
    },
  };

  return { marks: {}, nodes };
}

/**
 * Node view of an image (design §56).
 *
 * The `<img>` sits in a wrapper element, which is what a view needs to hang upload progress, a
 * placeholder or an error state on (design §70) without re-creating the image itself. An image is
 * an atom, so the view has no `contentDOM`; the wrapper is the element the position bridge
 * addresses.
 *
 * `update` answers `false` as soon as the source changed, which asks the view to build a fresh view
 * instead of keeping one that shows the wrong picture.
 */
export const imageNodeView: NodeViewFactory = (node, context) => {
  if (node.name !== 'image') {
    return null;
  }

  return createImageNodeView(node, context);
};

/** View-only player inside a mapped block wrapper, with space for attached controls. */
export const mediaBlockNodeView: NodeViewFactory = (node, context) => {
  if (node.name !== 'video' && node.name !== 'embed') {
    return null;
  }
  const dom = context.document.createElement('div');
  dom.className = 'rt-media';
  dom.setAttribute('contenteditable', 'false');
  dom.setAttribute('data-node-selection', 'controls');
  const render = (next: DocNode) => {
    const source =
      next.name === 'video'
        ? videoFrameUrl(next.attr('provider'), next.attr('id'), next.attr('url'))
        : frameUrl(next.attr('url'));
    const tag =
      next.name === 'video' && next.attr('provider') === 'native'
        ? 'video'
        : source
          ? 'iframe'
          : 'div';
    let player = dom.firstElementChild as HTMLElement | null;
    if (!player || player.tagName.toLowerCase() !== tag) {
      player = context.document.createElement(tag);
      dom.replaceChildren(player);
    }
    // Keep model metadata on the wrapper so DOM reconciliation never imports frame contents.
    applyAttrs(
      dom,
      next.name === 'video'
        ? {
            'data-height': numberAttr(next, 'height'),
            'data-id': stringAttr(next, 'id'),
            'data-node': 'video',
            'data-provider': stringAttr(next, 'provider'),
            'data-video-poster': urlAttr(next, 'poster'),
            'data-video-url': urlAttr(next, 'url'),
            'data-width': numberAttr(next, 'width'),
          }
        : {
            'data-embed-height': numberAttr(next, 'height'),
            'data-embed-html': stringAttr(next, 'html'),
            'data-embed-id': stringAttr(next, 'id'),
            'data-embed-poster': stringAttr(next, 'poster'),
            'data-embed-title': stringAttr(next, 'title'),
            'data-embed-url': frameUrl(next.attr('url')),
            'data-embed-width': numberAttr(next, 'width'),
            'data-node': 'embed',
            'data-provider': stringAttr(next, 'provider'),
          },
    );
    const attrs =
      tag === 'video'
        ? {
            controls: true,
            poster: urlAttr(next, 'poster'),
            src: urlAttr(next, 'url'),
          }
        : tag === 'iframe'
          ? {
              allow: FRAME_ALLOW,
              allowfullscreen: true,
              loading: 'lazy',
              referrerpolicy: frameReferrerPolicy(source),
              sandbox: frameSandbox(source),
              src: source,
              title: stringAttr(next, 'title') ?? 'Embedded media',
            }
          : { class: 'rt-media-placeholder' };
    if (tag === 'div') {
      player.textContent = stringAttr(next, 'title') ?? 'Embedded content';
    }
    const playerAttrs = {
      ...attrs,
      height: numberAttr(next, 'height') ?? (tag === 'iframe' ? 315 : null),
      width: numberAttr(next, 'width') ?? (tag === 'iframe' ? 560 : null),
    };
    applyAttrs(
      player,
      Object.fromEntries(
        Object.entries(playerAttrs).filter(
          ([name, value]) =>
            player!.getAttribute(name) !==
            (value === true ? '' : value == null ? null : String(value)),
        ),
      ),
    );
    if (tag === 'iframe') {
      const width = numberAttr(next, 'width');
      const height = numberAttr(next, 'height');
      player.style.setProperty('aspect-ratio', width && height ? `${width} / ${height}` : '16 / 9');
    }
  };
  render(node);
  return {
    dom,
    update: (next) => {
      if (next.name !== node.name) {
        return false;
      }
      render(next);
      return true;
    },
  };
};

/** Applies the attributes of `node` to the `<img>` of a node view. */
function applyImageAttrs(img: DOMElement, node: DocNode): void {
  applyAttrs(img, {
    alt: stringAttr(node, 'alt'),
    height: numberAttr(node, 'height'),
    src: urlAttr(node, 'src'),
    title: stringAttr(node, 'title'),
    width: numberAttr(node, 'width'),
  });
}

/**
 * Builds an image node view in the document of the view that asked for it.
 *
 * The factory is a plain function rather than a closure over a document, which is what makes it
 * usable from an iframe or a popup: the elements come from the document the editor is mounted in,
 * not from the global one.
 */
function createImageNodeView(node: DocNode, context: NodeViewContext): NodeView {
  const document = context.document;
  const img = document.createElement('img');
  const dom = document.createElement('span');

  dom.className = 'rt-image';
  // Image controls represent node selection; do not paint a native blue range over the image.
  dom.setAttribute('data-node-selection', 'controls');
  dom.setAttribute('contenteditable', 'false');
  dom.append(img);
  applyImageAttrs(img, node);

  const view: NodeView = {
    dom,
    update: (next) => {
      if (next.name !== 'image' || next.attr('src') !== node.attr('src')) {
        return false;
      }

      applyImageAttrs(img, next);

      return true;
    },
  };

  return view;
}

/** `value` as a number, or `null` when it is absent or not a number. */
function finiteNumber(value: unknown): null | number {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

/** Attribute of `node` as a number, or `null` when it is absent or not a number. */
function numberAttr(node: DocNode, name: string): null | number {
  const value = node.attr(name);

  return value === undefined || value === null ? null : finiteNumber(value);
}

/** Numeric attribute of `element`, or `null` when it is absent or not a number. */
function numberAttribute(element: Element, name: string): null | number {
  return finiteNumber(element.getAttribute(name));
}

/**
 * URL attribute of `element`.
 *
 * `undefined` means the attribute is absent, `null` that it is there but unsafe; only the caller
 * knows whether that rejects the element or just drops the attribute.
 */
function parseUrl(element: Element, name: string): null | string | undefined {
  const value = element.getAttribute(name);

  if (value === null || value.trim() === '') {
    return undefined;
  }

  const url = urlPolicy.sanitize(value);

  return url === '' ? null : url;
}

/** Attribute of `node` as a string, or `null` when it is absent or empty. */
function stringAttr(node: DocNode, name: string): null | string {
  const value = node.attr(name);

  return value === undefined || value === null || value === '' ? null : String(value);
}

/** Attribute of `node` as a URL, or `null` when it is absent or unsafe. */
function urlAttr(node: DocNode, name: string): null | string {
  const value = stringAttr(node, name);

  if (value === null) {
    return null;
  }

  const url = urlPolicy.sanitize(value);

  return url === '' ? null : url;
}
