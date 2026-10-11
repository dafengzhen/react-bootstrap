import type { Attrs } from '../util/object.ts';
import type { LinkAttrs } from './link.ts';
import type { UrlPolicyOptions } from './sanitize.ts';

import { linkTargetValue, safeLinkRel } from './presentation.ts';
import { htmlPolicy, sanitizeHtml, sanitizeUrl, urlPolicy } from './sanitize.ts';

/**
 * Adapters that turn external content into a value the editor can insert.
 *
 * Imported by the HTML parser and by hosts, so the policy that decides what is safe lives in
 * `serialization/sanitize.ts` and is only applied here.
 */

/**
 * Whether a URL may be used in a document.
 *
 * An empty URL passes the policy — nothing dangerous is in it — yet it is not a URL a document
 * can use, so it is refused here. A caller that wants the value cleaned rather than a predicate
 * asks {@link urlPolicy.sanitize}.
 */
export function isAllowedUrl(url: string): boolean {
  return url.trim() !== '' && urlPolicy.check(url);
}

/**
 * Builds the attribute bag of a link mark.
 *
 * The URL is validated here, so a `javascript:` link can never be inserted even when the caller
 * passes one, and `target` and `rel` go through the same two functions the schema's attribute
 * computers, the live view and the serializer use. That is the point of the helper rather than a
 * detail of it: a bag built here is inserted into a model that will re-derive both attributes, so a
 * second rule living in this file could only ever disagree with the one that wins. A target outside
 * the policy is dropped, and `rel` is rebuilt from the safe token set — a `_blank` link gets
 * `noopener noreferrer`, and an explicit `rel="opener"` is filtered out rather than believed.
 */
export function linkAttrsFrom(attrs: LinkAttrs): Attrs {
  const href = urlPolicy.sanitize(attrs.href ?? '');

  if (!href) {
    return {};
  }

  const target = linkTargetValue(attrs.target);

  return {
    href,
    rel: safeLinkRel(target, attrs.rel),
    target,
    title: attrs.title ?? null,
  };
}

/**
 * Sanitizes an HTML string coming from outside the editor.
 *
 * Pasted HTML, a value loaded from a rich text column or markup from a template is never
 * trusted: it is cleaned before it is parsed into the document model.
 *
 * ```ts
 * parseHtml('<p>Hello <script>alert(1)</script></p>'); // "<p>Hello </p>"
 * ```
 *
 * This is the **first** pass of that import pipeline and not a sanitiser a host can end on. It is
 * string level — the core has no DOM (see `serialization/sanitize.ts`) — so what it removes is what
 * a string can be asked about: forbidden tags, event handlers and URLs the policy refuses. It does
 * **not** apply the link target and `rel` policy and it does not restrict `style`, because both need
 * the element a real parser builds; the DOM parse that follows, and the schema attribute computers
 * behind it, are where they are applied. Read `sanitizeHtml` for what that means for a caller.
 *
 * @param html - markup to clean
 * @param options - URL policy options, for a host that accepts a `data:` URL the default refuses
 */
export function parseHtml(html: string, options?: UrlPolicyOptions): string {
  return htmlPolicy.sanitize(html, options);
}

/** Re-exported so an adapter can clean markup and URLs from one module. */
export { sanitizeHtml, sanitizeUrl };
