import type { DOMElement } from './dom-types.ts';
import type { ObjectUrlRegistry } from './object-url.ts';

import { ErrorCode, viewError } from '../util/errors.ts';
import { pathOf } from './dom-reconcile.ts';

/**
 * The small conversions between a browser event and what the editor understands.
 *
 * These are the parts of the view that have no state and no DOM of their own: reading a drag
 * payload, turning a `keydown` into the shape the headless core takes, reading a dropped file as
 * markup, reading the identity of the browser's selection. They live here rather than in
 * `EditorView` because none of them needs the view, and because each one is a place where an engine
 * difference has to be handled.
 */

/** What a drag carries, as far as the editor cares. */
export interface DragPayload {
  /** Files the drag carried, in the order the browser listed them. */
  files: readonly File[];
  /** Whether the drag carries anything the editor could insert. */
  hasContent: boolean;
  /** Markup flavour, when the drag carried one. */
  html?: string;
  /** Plain text flavour, when the drag carried one. */
  text?: string;
}

/**
 * What a drag carries.
 *
 * A file is not turned into markup here — that needs the file to be read, which is asynchronous —
 * so this only reports what arrived. `hasContent` is what decides whether the editor claims the
 * drop at all: a payload it cannot represent has to be left to the browser, or dropping a link onto
 * the editor would do nothing anywhere.
 */
export function dragPayload(transfer: DataTransfer | null): DragPayload {
  if (!transfer) {
    return { files: [], hasContent: false };
  }

  const html = transfer.getData('text/html');
  const text = transfer.getData('text/plain');
  const files = Array.from(transfer.files ?? []);
  const payload: DragPayload = { files, hasContent: files.length > 0 };

  if (html) {
    payload.html = html;
    payload.hasContent = true;
  }

  if (text) {
    payload.text = text;
    payload.hasContent = true;
  }

  return payload;
}

/** `value` with the characters that would end an attribute escaped. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/**
 * Markup a dropped file becomes, or `null` when the editor has no markup for it.
 *
 * The tag is the one the media nodes render as, so dropping a file and pasting the same markup lead
 * to the same document: `<img>` for a picture, `<video>` and `<audio>` for a clip, and an anchor
 * for anything else, which the attachment node claims when it carries a name.
 *
 * A picture becomes a `data:` URL, because a picture is small enough to live inside the document
 * and then survives a reload and a copy. A clip or an attachment becomes an object URL, which is an
 * address into this page only — so the URL is acquired from the view's registry, which knows when
 * the last node showing it is gone and revokes it.
 */
export async function fileMarkup(file: File, urls: ObjectUrlRegistry): Promise<null | string> {
  const name = escapeHtml(file.name);

  if (file.type.startsWith('image/')) {
    const src = await readAsDataUrl(file);

    return src ? `<img src="${escapeHtml(src)}" alt="${name}">` : null;
  }

  if (file.type.startsWith('video/')) {
    return `<video src="${escapeHtml(urls.acquire(file))}" data-provider="native"></video>`;
  }

  if (file.type.startsWith('audio/')) {
    return `<audio src="${escapeHtml(urls.acquire(file))}" title="${name}"></audio>`;
  }

  if (file.type !== '') {
    const href = escapeHtml(urls.acquire(file));

    return `<a href="${href}" download data-name="${name}" data-mime-type="${escapeHtml(file.type)}" data-size="${String(file.size)}">${name}</a>`;
  }

  return null;
}

/** The browser event a view was given, in the shape the core understands. */
export function keyEventLike(event: KeyboardEvent): {
  altKey: boolean;
  ctrlKey: boolean;
  key: string;
  metaKey: boolean;
  preventDefault: () => void;
  shiftKey: boolean;
} {
  return {
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    key: event.key,
    metaKey: event.metaKey,
    preventDefault: () => {
      event.preventDefault();
    },
    shiftKey: event.shiftKey,
  };
}

/** Text a clipboard event carried, as far as the editor reads it. */
export function readClipboard(event: ClipboardEvent): { html?: string; text?: string } {
  const transfer = event.clipboardData;
  const html = transfer?.getData('text/html') ?? '';
  const text = transfer?.getData('text/plain') ?? '';

  // An empty flavour is the same as an absent one: a browser that has no HTML to offer reports an
  // empty string, and treating that as content would make every plain-text paste "rich".
  return { ...(html ? { html } : {}), ...(text ? { text } : {}) };
}

/**
 * Resolves the element a view mounts into.
 *
 * A string is a selector, which is the convenient form for a host application; anything else is
 * taken as the element itself. An element that cannot be found is a `ViewError` naming the
 * selector, because a view that mounted into nothing would fail much later and much less clearly.
 */
export function resolveElement(element: unknown): DOMElement {
  if (typeof element === 'string') {
    const found = globalThis.document?.querySelector(element);

    if (!found) {
      throw viewError(ErrorCode.ELEMENT_NOT_FOUND, `No element matches "${element}"`, {
        selector: element,
      });
    }

    return found as DOMElement;
  }

  if (element && typeof element === 'object' && 'nodeType' in element) {
    return element as DOMElement;
  }

  if (globalThis.document?.body) {
    return globalThis.document.body as DOMElement;
  }

  throw viewError(
    ErrorCode.DOM_UNAVAILABLE,
    'A view needs a document, and this environment has none',
  );
}

/**
 * Identity of a DOM selection, or `null` when there is none.
 *
 * The browser reports a selection the view just wrote as a change of its own, and comparing the
 * identity of what was written with what came back is what tells the two apart. It matters for a
 * `NodeSelection`: a browser only knows ranges of characters, so reading back the range the view
 * created for a node would replace the node selection with the text position at its edge.
 */
export function selectionKey(selection: globalThis.Selection | null): null | string {
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);

  return [
    String(range.startContainer.nodeType),
    pathOf(range.startContainer),
    String(range.startOffset),
    pathOf(range.endContainer),
    String(range.endOffset),
  ].join(':');
}

/** Writes a payload into a copy or cut event, and claims the event. */
export function writeClipboard(
  event: ClipboardEvent,
  payload: { html?: string; text?: string },
): void {
  if (!event.clipboardData) {
    return;
  }

  if (payload.text !== undefined) {
    event.clipboardData.setData('text/plain', payload.text);
  }

  if (payload.html !== undefined) {
    event.clipboardData.setData('text/html', payload.html);
  }

  event.preventDefault();
}

/** Reads a file as a data URL, or `null` when the read fails. */
function readAsDataUrl(file: File): Promise<null | string> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      resolve(typeof reader.result === 'string' ? reader.result : null);
    });
    reader.addEventListener('error', () => resolve(null));
    reader.readAsDataURL(file);
  });
}

import { renderNode } from './dom-renderer.ts';
void renderNode;
