import type { Node as DocNode } from '../model/node.ts';

/**
 * The `rel` tokens a link that opens a new browsing context always carries.
 *
 * They are the ones `safeLinkRel` pushes, rather than a second copy of the same string: the
 * exported constant and the rule cannot drift if one is built from the other.
 */
const BLANK_LINK_REL_TOKENS: readonly string[] = ['noopener', 'noreferrer'];

/** Safe default for a link that opens a new browsing context: the tokens above, joined. */
export const SAFE_LINK_REL = BLANK_LINK_REL_TOKENS.join(' ');

/** `rel` tokens a link may carry; anything else is dropped rather than written out. */
const SAFE_REL_TOKENS: ReadonlySet<string> = new Set([
  'external',
  'nofollow',
  'noopener',
  'noreferrer',
  'sponsored',
  'ugc',
]);

/** Alignment keywords a block may name, the ones CSS accepts for `text-align`. */
const ALIGN_VALUES: ReadonlySet<string> = new Set(['center', 'justify', 'left', 'right']);

/** Font size keywords a mark may name, the ones CSS accepts for `font-size`. */
const FONT_SIZE_KEYWORDS: ReadonlySet<string> = new Set([
  'large',
  'larger',
  'medium',
  'small',
  'smaller',
  'x-large',
  'x-small',
  'xx-large',
  'xx-small',
]);

/** Deepest indentation a block may carry, so that a hostile value cannot nest without end. */
const MAX_INDENT = 8;

/**
 * The safe CSS declaration list for a block's presentation attributes.
 *
 * `left` alignment is not written, because it is what a block already renders as; every value
 * comes from a grammar the parser reads back the same way.
 *
 * This is the whole presentation rule and it touches no element: the live view writes the result
 * into a `style` attribute and the HTML serializer writes the same string into the markup, so a
 * document cannot look like one thing on screen and another in the file it was saved to.
 */
export function blockPresentationStyle(node: DocNode): string {
  const declarations: Record<string, null | string> = {};
  const align = alignValue(node);

  if (align !== null && align !== 'left') {
    declarations['text-align'] = align;
  }

  const lineHeight = lineHeightValue(node);

  if (lineHeight !== null) {
    declarations['line-height'] = lineHeight;
  }

  for (const [name, property] of [
    ['marginTop', 'margin-top'],
    ['marginBottom', 'margin-bottom'],
  ] as const) {
    const value = spacingValue(node, name);

    if (value !== null) {
      declarations[property] = value;
    }
  }

  return Object.entries(declarations)
    .filter((entry): entry is [string, string] => entry[1] !== null && entry[1] !== '')
    .map(([property, value]) => `${property}: ${value}`)
    .join('; ');
}

/** A CSS length accepted by the editor's presentation policy. */
export function cssLength(text: string): null | string {
  const trimmed = text.trim();

  return /^(?:\d+(?:\.\d+)?|\.\d+)(?:ch|cm|em|ex|in|mm|pc|pt|px|q|rem|vh|vmax|vmin|vw|%)$/.test(
    trimmed,
  )
    ? trimmed
    : null;
}

/** Indentation level of `node`, or `null` when it is absent or unusable. */
export function indentationOf(node: DocNode): null | number {
  const indent = Number(node.attr('indent') ?? 0);

  return Number.isInteger(indent) && indent > 0 ? Math.min(indent, MAX_INDENT) : null;
}

/** A safe inline mark style value, or `null` when it is outside the supported grammar. */
export function inlineStyleValue(
  kind: 'color' | 'font-family' | 'font-size',
  value: unknown,
): null | string {
  const text = String(value ?? '').trim();

  if (text === '') {
    return null;
  }

  if (kind === 'font-size') {
    const lower = text.toLowerCase();

    return cssLength(lower) ?? (FONT_SIZE_KEYWORDS.has(lower) ? lower : null);
  }

  if (kind === 'font-family') {
    // Family names may be quoted and comma-separated, but cannot contain CSS syntax that starts a
    // second declaration or function. This deliberately excludes escapes and custom variables.
    return /^[\p{L}\p{N}\s,_'"-]+$/u.test(text) ? text : null;
  }

  if (/^#[\da-f]{3}(?:[\da-f]{1}|[\da-f]{3}|[\da-f]{5})?$/i.test(text)) {
    return text;
  }

  if (/^[a-z]+$/i.test(text)) {
    return text;
  }

  return /^(?:rgb|rgba|hsl|hsla)\([\d.,%+\-\s/]+\)$/i.test(text) ? text : null;
}

/**
 * Canonical link target, or `null` when the value names no browsing context this policy allows.
 *
 * Two targets are supported, and they are the two `LinkAttrs.target` declares: `_blank` opens a new
 * browsing context, `_self` stays in the one the document is already in. The reserved names are
 * ASCII case-insensitive, so `_BLANK` is `_blank`.
 *
 * Everything else is refused rather than passed through, because a target is navigation policy
 * rather than a string. `_parent` and `_top` navigate a context the document does not own, and a
 * named target either reuses a browsing context the host created for its own purposes or creates
 * one — so a value that arrives as untyped JSON, from storage, the network or a clipboard, would
 * otherwise pick where a click lands without the host ever agreeing to it. The public type is a
 * compile-time promise; this is the same promise kept at runtime, which is the only place an
 * untyped document can be held to it.
 */
export function linkTargetValue(value: unknown): '_blank' | '_self' | null {
  const target = String(value ?? '')
    .trim()
    .toLowerCase();

  return target === '_blank' || target === '_self' ? target : null;
}

/** `value` as a finite number when it contains only a number. */
export function numberValue(value: unknown): null | number {
  const text = String(value).trim();

  if (!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(text)) {
    return null;
  }

  const parsed = Number(text);

  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Canonical safe `rel` tokens for a link target — the one rule every link boundary applies.
 *
 * The tokens a caller passes are filtered rather than copied, so `opener` — the relation that hands
 * a new browsing context a handle back into this one — cannot survive, whatever spelling it arrives
 * in. A `_blank` link always ends up with `noopener noreferrer` in addition to the tokens that were
 * kept, and a link whose tokens are all dropped carries no `rel` at all rather than an empty one.
 *
 * The target is read through {@link linkTargetValue}, so the pair is canonicalized together, but
 * the two decisions are independent: `noopener` on a `_self` link is a `rel` a caller asked for and
 * is kept, while `opener` is dropped whatever the target is.
 */
export function safeLinkRel(targetValue: unknown, relValue: unknown): null | string {
  const target = linkTargetValue(targetValue);
  const tokens = String(relValue ?? '')
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => SAFE_REL_TOKENS.has(token));

  if (target === '_blank') {
    tokens.push(...BLANK_LINK_REL_TOKENS);
  }

  const unique = [...new Set(tokens)];

  return unique.length > 0 ? unique.join(' ') : null;
}

/** Canonical model value for a spacing length parsed from CSS. */
export function spacingModelValue(value: string): null | number | string {
  const length = spacingCssLength(value);

  if (length === null) {
    return null;
  }

  const pixels = /^(-?(?:\d+(?:\.\d+)?|\.\d+))px$/.exec(length);

  return pixels ? Number(pixels[1]) : length;
}

/** Alignment of `node` when it names one CSS accepts, and `null` otherwise. */
function alignValue(node: DocNode): null | string {
  const value = node.attr('align');

  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value).toLowerCase();

  return ALIGN_VALUES.has(text) ? text : null;
}

/** Line height of `node` as a CSS declaration value, where a bare number is a multiplier. */
function lineHeightValue(node: DocNode): null | string {
  const value = node.attr('lineHeight');

  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : null;
  }

  const number = numberValue(value);

  return number === null ? cssLength(String(value)) : String(number);
}

/** A CSS length suitable for spacing, where negative values are valid. */
function spacingCssLength(text: string): null | string {
  const trimmed = text.trim();

  return /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:ch|cm|em|ex|in|mm|pc|pt|px|q|rem|vh|vmax|vmin|vw|%)$/.test(
    trimmed,
  )
    ? trimmed
    : null;
}

/**
 * Spacing of `node` as a CSS declaration value; a numeric `0` is dropped, because spacing already
 * defaults to zero.
 */
function spacingValue(node: DocNode, name: string): null | string {
  const value = node.attr(name);

  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value === 0 ? null : `${String(value)}px`;
  }

  return spacingCssLength(String(value));
}
