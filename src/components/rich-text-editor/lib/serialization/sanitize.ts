/**
 * The security policy: URL, MIME and HTML safety in one module. External input — pasted HTML,
 * loaded JSON, a typed URL, an attribute read back from a parsed element — is never trusted, and
 * the rule that decides what may be used lives here alone: a rule that exists twice drifts, and the
 * copy that learns a spelling the other refuses writes a dangerous URL into the document.
 *
 * `check` **validates** — whether a value may be used, nothing else. `sanitize` **cleans** — the
 * value when it passes and `''` when it does not, so a caller can drop the attribute rather than
 * write one that points nowhere. A value that passes comes back as given, minus surrounding
 * whitespace: the policy decides keep-or-drop, never rewriting. An empty value both passes and
 * cleans to `''`, so a caller telling "absent" from "refused" asks `check`.
 *
 * Four policies — {@link urlPolicy}, {@link dataUrlPolicy}, {@link attributePolicy}, {@link
 * htmlPolicy} — plus the historical names (`isSafeUrl`, `sanitizeUrl`, …) as thin wrappers for
 * existing callers.
 */

/**
 * Media types an inline `data:` URL may carry.
 *
 * A pasted or dropped picture arrives as `data:image/png;base64,…` and has no other source, so
 * refusing `data:` outright would lose it. The list is explicit rather than a prefix rule such as
 * `image/`, which admits every subtype a browser learns to render later — `image/svg+xml` was that
 * accident. Only media is listed: a `data:` URL carrying a document, `text/html` above all, runs
 * script in the page's own origin. The type is read from `data:<media type>[;parameter],<content>`
 * and compared in full, so a host that needs another type changes this list deliberately.
 */
export const ALLOWED_DATA_MIME_TYPES: readonly string[] = [
  'audio/aac',
  'audio/flac',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/webp',
  'video/mp4',
  'video/ogg',
  'video/quicktime',
  'video/webm',
];

/**
 * The former name of {@link ALLOWED_DATA_MIME_TYPES}, kept so that no import breaks. It used to be
 * the prefix list `['audio/', 'image/', 'video/']`, which admitted `image/svg+xml` too; a caller
 * that used it as one reads {@link SVG_DATA_MIME_TYPES} to see what moved out.
 */
export const ALLOWED_DATA_TYPES: readonly string[] = ALLOWED_DATA_MIME_TYPES;

/**
 * Protocols allowed in a URL attribute. Everything else is refused, including the harmless looking
 * ones: `blob:` and `file:` name a document or a local file rather than a resource, `about:` is a
 * browser internal, and `javascript:`, `vbscript:` and `data:` are execution contexts. The
 * comparison uses the value {@link normalizeUrl} produces, so control characters or a character
 * reference cannot spell an allowed protocol.
 */
export const ALLOWED_PROTOCOLS: readonly string[] = ['http:', 'https:', 'mailto:', 'tel:'];

/** Attributes removed from every element, whatever it is. */
export const FORBIDDEN_ATTRIBUTES: readonly string[] = ['srcdoc'];

/** Tags removed together with their content. */
export const FORBIDDEN_TAGS: readonly string[] = [
  'base',
  'embed',
  'form',
  'iframe',
  'link',
  'meta',
  'noscript',
  'object',
  'script',
  'style',
];

/**
 * Media types of SVG images, which stay refused unless a caller opts in.
 *
 * SVG is a document format, not a picture format: it may carry `<script>` and `on*` attributes. An
 * `<img src="data:image/svg+xml,…">` does not run that script in the engines this editor targets,
 * but the same URL executes as soon as it is navigated to, put into an `<iframe>` or `<object>`, or
 * read back out of a document and rendered as HTML by a host. That makes it a decision for the host
 * rather than a default: the media rules of the view render an image as an `<img>` and keep the
 * default, so SVG goes in only where a caller passes `allowSvgDataUrls: true`.
 */
export const SVG_DATA_MIME_TYPES: readonly string[] = ['image/svg+xml'];

/** A policy that decides whether an attribute name survives sanitizing. */
export interface AttributePolicy {
  /** Whether an attribute called `name` may be kept. */
  allow(name: string): boolean;
}

/** A policy that decides whether a `data:` URL carries content rather than a document. */
export interface DataUrlPolicy {
  /** Whether `url` is a `data:` URL of an allowed media type. */
  check(url: string, options?: UrlPolicyOptions): boolean;
  /** `url` when {@link DataUrlPolicy.check} accepts it, and `''` when it does not. */
  sanitize(url: string, options?: UrlPolicyOptions): string;
}

/** A policy that removes dangerous markup from an HTML string. */
export interface HtmlPolicy {
  /**
   * `html` without forbidden tags, event handlers and dangerous URL attributes.
   *
   * The first pass of the import pipeline rather than a terminal sanitiser — see
   * {@link sanitizeHtml} for what it deliberately leaves to the DOM parse behind it.
   */
  sanitize(html: string, options?: UrlPolicyOptions): string;
}

/** A policy that decides which URLs may reach an attribute. */
export interface UrlPolicy {
  /** Whether `url` may be used in an attribute. */
  check(url: string, options?: UrlPolicyOptions): boolean;
  /** `url` when {@link UrlPolicy.check} accepts it, and `''` when it does not. */
  sanitize(url: string, options?: UrlPolicyOptions): string;
}

/** Options that loosen the URL policy for one call. */
export interface UrlPolicyOptions {
  /**
   * Whether a `data:` URL may carry an SVG image; defaults to `false`.
   *
   * {@link SVG_DATA_MIME_TYPES} says why the default refuses it and what turning it on takes on.
   * The option is per call rather than global state, so a host rendering SVG through a sandboxed
   * frame can accept it there without loosening the policy links, pasted HTML and loaded JSON are
   * held to.
   */
  allowSvgDataUrls?: boolean;
}

/** The attribute policy of {@link checkAttributeName}. */
export const attributePolicy: AttributePolicy = {
  allow(name: string): boolean {
    return checkAttributeName(name);
  },
};

/** The data URL policy of {@link checkDataUrl} and {@link cleanDataUrl}. */
export const dataUrlPolicy: DataUrlPolicy = {
  check(url: string, options?: UrlPolicyOptions): boolean {
    return checkDataUrl(url, options);
  },
  sanitize(url: string, options?: UrlPolicyOptions): string {
    return cleanDataUrl(url, options);
  },
};

/** The HTML policy of {@link sanitizeMarkup}. */
export const htmlPolicy: HtmlPolicy = {
  sanitize(html: string, options?: UrlPolicyOptions): string {
    return sanitizeMarkup(html, options);
  },
};

/** The URL policy of {@link checkUrl} and {@link cleanUrl}. */
export const urlPolicy: UrlPolicy = {
  check(url: string, options?: UrlPolicyOptions): boolean {
    return checkUrl(url, options);
  },
  sanitize(url: string, options?: UrlPolicyOptions): string {
    return cleanUrl(url, options);
  },
};

/**
 * Whether an attribute name is safe to keep; the policy is {@link attributePolicy}, whose rules
 * {@link checkAttributeName} documents.
 */
export function isSafeAttribute(name: string): boolean {
  return attributePolicy.allow(name);
}

/**
 * Whether `url` is a `data:` URL that carries media rather than a document; the policy is
 * {@link dataUrlPolicy.check}, whose rules {@link isAllowedDataUrl} documents.
 */
export function isSafeDataUrl(url: string, options?: UrlPolicyOptions): boolean {
  return dataUrlPolicy.check(url, options);
}

/**
 * Whether a URL is safe to put into an attribute; the policy is {@link urlPolicy.check}, whose
 * rules {@link checkUrl} documents.
 */
export function isSafeUrl(url: string, options?: UrlPolicyOptions): boolean {
  return urlPolicy.check(url, options);
}

/**
 * Removes dangerous markup from an HTML string: forbidden tags with their content, every event
 * handler and every URL attribute the policy refuses, leaving the rest untouched.
 *
 * It is a conservative, dependency free string level pass, combined with a DOM based parse before
 * the result reaches the document model, and it applies the same {@link urlPolicy} the DOM parser
 * and the serializer apply — the three cannot disagree about what a dangerous URL is.
 *
 * **It is the first pass of the import pipeline, not a terminal sanitiser.** The name says what it
 * removes, not what it guarantees, and the difference is worth stating because the obvious use is
 * the one it cannot support:
 *
 * ```ts
 * container.innerHTML = sanitizeHtml(untrusted); // not a supported use
 * ```
 *
 * What survives that a DOM parse would then remove: `rel="opener"` and any `target` on an `<a>`,
 * because the link target and `rel` policy is stated in terms of an element
 * (`serialization/presentation.ts`) and applied by the schema's attribute computers; and every
 * `style` declaration, because the editor's presentation policy is an allowlist over the
 * attributes of a *node*, not a CSS parser (an unrecognised `style` here belongs to the host's own
 * markup, and the model path never reads one back). Scripts, event handlers and `javascript:`
 * URLs — the sinks that execute — are removed, so the result is safe to hand to the DOM parser
 * this pipeline continues with, and to nothing else.
 *
 * A host that needs a string it can write to `innerHTML` needs a terminal sanitiser built for its
 * own threat model: one that parses the markup into a real DOM, allowlists tags, attributes and
 * style properties, and normalises what a browser would otherwise accept. Passing this output
 * through {@link urlPolicy} again does not make it one.
 */
export function sanitizeHtml(html: string, options?: UrlPolicyOptions): string {
  return htmlPolicy.sanitize(html, options);
}

/**
 * Returns a media URL when it is safe and an empty string otherwise.
 *
 * Media goes through the same {@link urlPolicy} as every other URL — a `data:` URL carrying media
 * is part of it, not an exception made here — so the view rules that render an `<img>`, the parser
 * that reads one back and the serializer that writes one cannot disagree. The name survives because
 * the media rules read it as the rule for a source; {@link urlPolicy} is the policy itself.
 */
export function sanitizeMediaUrl(url: string, options?: UrlPolicyOptions): string {
  return urlPolicy.sanitize(url, options);
}

/**
 * Returns `url` when it is safe and an empty string otherwise, so a caller can drop the attribute
 * rather than emit a broken link. The value comes back trimmed and otherwise unchanged: sanitizing
 * decides whether a value may be used, not what it says.
 */
export function sanitizeUrl(url: string, options?: UrlPolicyOptions): string {
  return urlPolicy.sanitize(url, options);
}

/**
 * Whether an attribute name is safe to keep: {@link FORBIDDEN_ATTRIBUTES} is dropped by name, and
 * both an event handler (`on*`, which is script) and a namespaced name such as `xlink:href` — a
 * second way to write a URL attribute the URL policy never sees — are dropped by shape rather than
 * by an endless list.
 */
function checkAttributeName(name: string): boolean {
  const lower = name.toLowerCase();

  if (FORBIDDEN_ATTRIBUTES.includes(lower)) {
    return false;
  }

  return !lower.startsWith('on') && !lower.includes(':');
}

/** {@link isAllowedDataUrl} over the normalized copy of `url`. */
function checkDataUrl(url: string, options?: UrlPolicyOptions): boolean {
  return isAllowedDataUrl(normalizeUrl(url), options);
}

/**
 * Whether `url` may be used in an attribute.
 *
 * - A relative URL (`a.png`, `/docs/a.png`, `#frag`, `?q=1`) is allowed, because it resolves
 *   against the page that already runs the document.
 * - A protocol relative URL (`//example.com/a.png`) is allowed: it inherits the protocol of the
 *   page, so no protocol is taken from the input.
 * - An absolute URL has to use a protocol from {@link ALLOWED_PROTOCOLS}, compared in full.
 * - A `data:` URL has to carry media and never a document ({@link isAllowedDataUrl}).
 *
 * The decision is made on the normalized copy {@link normalizeUrl} returns, not the raw string,
 * which is what refuses the spellings a parser would accept: `&#106;avascript:`,
 * `javascript&#x3a;alert(1)`, `java\0script:`, `java\tscript:` and `java\script:` all reach the
 * protocol comparison as `javascript:`. The value a caller keeps stays the original one.
 */
function checkUrl(url: string, options?: UrlPolicyOptions): boolean {
  const normalized = normalizeUrl(url);

  if (normalized === '') {
    return true;
  }

  if (normalized.startsWith('//')) {
    return true;
  }

  if (normalized.startsWith('data:')) {
    return isAllowedDataUrl(normalized, options);
  }

  const colon = normalized.indexOf(':');
  const slash = normalized.indexOf('/');

  if (colon === -1 || (slash !== -1 && slash < colon)) {
    return true;
  }

  return ALLOWED_PROTOCOLS.includes(normalized.slice(0, colon + 1));
}

/** `url` trimmed when {@link checkDataUrl} accepts it, and `''` when it does not. */
function cleanDataUrl(url: string, options?: UrlPolicyOptions): string {
  const trimmed = url.trim();

  return checkDataUrl(trimmed, options) ? trimmed : '';
}

/** `url` trimmed when {@link checkUrl} accepts it, and `''` when it does not. */
function cleanUrl(url: string, options?: UrlPolicyOptions): string {
  const trimmed = url.trim();

  return checkUrl(trimmed, options) ? trimmed : '';
}

/**
 * `value` with the character references that can change how a URL is parsed replaced by the
 * characters they name.
 *
 * An HTML parser decodes such a reference before the value becomes a URL, so
 * `href="&#106;avascript:alert(1)"` and `href="javascript&colon;alert(1)"` are both script URLs in
 * the DOM though neither holds the string `javascript:`. Every **numeric** reference is decoded,
 * because any character can hide in one (`&#106;` is `j`, `&#x3a;` is `:`); one without its
 * semicolon is decoded too, which is stricter than an HTML parser reading an attribute — refusing
 * is the direction this policy errs in. Of the **named** references only the three that can reshape
 * a URL are decoded: `&colon;` is `:`, and `&Tab;` and `&NewLine;` are whitespace that a URL parser
 * removes wherever it appears. Every other name either spells a character no protocol can contain
 * or leaves its `&` in the string, where the protocol comparison refuses it; the DOM parser
 * re-checks each URL of a real element after decoding the full table, which handles the rest.
 * `&Colon;` is deliberately not touched: it is U+2237, not a colon.
 */
function decodeCharacterReferences(value: string): string {
  return value
    .replace(/&#(x[0-9a-f]+|[0-9]+);?/gi, decodeNumericReference)
    .replace(/&colon;/g, ':')
    .replace(/&(?:NewLine|Tab);/g, '');
}

/** The character a numeric reference names, or `match` when the code point is not one. */
function decodeNumericReference(match: string, code: string): string {
  const hexadecimal = code.startsWith('x') || code.startsWith('X');
  const point = Number.parseInt(hexadecimal ? code.slice(1) : code, hexadecimal ? 16 : 10);

  if (!Number.isFinite(point) || point < 0 || point > 0x10ffff) {
    return match;
  }

  return String.fromCodePoint(point);
}

/**
 * Whether the normalized `url` is a `data:` URL of an allowed media type: the type between `data:`
 * and the first comma — up to the first `;` parameter — is compared in full against
 * {@link ALLOWED_DATA_MIME_TYPES}, plus {@link SVG_DATA_MIME_TYPES} when the caller opted in. A
 * `data:` URL without a comma carries nothing.
 */
function isAllowedDataUrl(normalized: string, options?: UrlPolicyOptions): boolean {
  if (!normalized.startsWith('data:')) {
    return false;
  }

  const comma = normalized.indexOf(',');

  if (comma === -1) {
    return false;
  }

  const mediaType = normalized.slice('data:'.length, comma).split(';')[0] ?? '';

  if (ALLOWED_DATA_MIME_TYPES.includes(mediaType)) {
    return true;
  }

  return options?.allowSvgDataUrls === true && SVG_DATA_MIME_TYPES.includes(mediaType);
}

/**
 * `value` reduced to the spelling the URL decision is made on; each transformation closes a hole.
 *
 * **Character references are decoded** by {@link decodeCharacterReferences}, because a parser
 * decodes them before the URL is resolved. **Whitespace and control characters are removed**: the
 * URL standard removes ASCII tab and newline anywhere in an input and trims the C0 controls and
 * spaces around it, a legacy parser ignores a NUL as well, and `\s` covers the non-ASCII spaces —
 * so `java\tscript:`, `java\nscript:` and `java\u0085script:` all reach a parser that reads them as
 * `javascript:`. **Backslashes are removed**, because a legacy engine resolves `java\script:` as a
 * script URL and no URL this policy keeps needs one. The result is lowercased, so protocol and
 * media type compare with a plain `includes`; only a decision uses it — {@link sanitizeUrl} hands
 * back the URL it was given.
 */
function normalizeUrl(value: string): string {
  return decodeCharacterReferences(value)
    .replace(/[\s\u007f-\u009f]|[^\u0020-\uffff]/g, '')
    .replaceAll('\\', '')
    .toLowerCase();
}

/**
 * {@link htmlPolicy.sanitize}, with the URL decision shared with the parser and the serializer.
 *
 * It is string level on purpose — the core has no DOM (design §77) — so it is the first line and
 * not the only one: a DOM parse of the result reads every `href` and `src` back out of a real
 * element, where the HTML parser has decoded character references the string level pass could only
 * guess at, and the schema's attribute computers apply the target, `rel` and style policy that
 * needs that element to exist. Its output is what the parser is handed, never what a host writes
 * into `innerHTML`; {@link sanitizeHtml} is where that boundary is written down.
 */
function sanitizeMarkup(html: string, options?: UrlPolicyOptions): string {
  let result = html;

  for (const tag of FORBIDDEN_TAGS) {
    result = stripTag(result, tag);
  }

  result = stripComments(result);
  result = stripEventHandlers(result);
  result = stripDangerousUrls(result, options);

  return result;
}

/** Removes HTML comments, which are a classic hiding place for scripts. */
function stripComments(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

/** Removes every attribute whose value is an unsafe URL. */
function stripDangerousUrls(html: string, options?: UrlPolicyOptions): string {
  return html.replace(
    /(\s(?:href|src|action|formaction|xlink:href)\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi,
    (match, _prefix: string, double: string, single: string, bare: string) => {
      const value = double ?? single ?? bare ?? '';

      return checkUrl(value, options) ? match : '';
    },
  );
}

/** Removes every `on*` attribute. */
function stripEventHandlers(html: string): string {
  return html.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}

/**
 * Removes every `<tag>...</tag>` pair and every self closing `<tag />`, so a tag the markup never
 * closes cannot survive as an opener: {@link FORBIDDEN_TAGS} go with their content.
 */
function stripTag(html: string, tag: string): string {
  const paired = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}\\s*>`, 'gi');
  const selfClosing = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi');

  return html.replace(paired, '').replace(selfClosing, '');
}
