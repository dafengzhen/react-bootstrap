import type { Mark } from '../model/mark.ts';
import type { Node as DocNode } from '../model/node.ts';
import type { Attrs } from '../util/object.ts';

import { isTextNode } from '../model/text-node.ts';
import { headingLevel, MARK_RULES, NODE_RULES } from './html-rules.ts';
import {
  blockPresentationStyle,
  indentationOf,
  inlineStyleValue,
  linkTargetValue,
  safeLinkRel,
} from './presentation.ts';
import { urlPolicy } from './sanitize.ts';

/** Options of {@link serializeDocument}. */
export interface SerializeOptions {
  /** String inserted between top level blocks; defaults to `""`. */
  joinWith?: string;
}

/** Escapes a value used inside an HTML attribute. */
export function escapeAttribute(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;');
}

/** Escapes text content for HTML output. */
export function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\u00a0/g, '&nbsp;');
}

/**
 * Serializes a document to HTML.
 *
 * HTML is an exchange format, never the internal model: this walks the document
 * tree and writes elements according to the rules in `html-rules.ts`. URLs are
 * validated on the way out as well, so a document that was loaded from untrusted
 * JSON can never emit a `javascript:` link. The rule is `urlPolicy.check`, the one
 * the parser and the HTML sanitizer use, so what this writer emits is what they
 * accept.
 *
 * ```ts
 * getHTML(doc); // "<p>Hello <strong>world</strong></p>"
 * ```
 */
export function serializeDocument(doc: DocNode, options: SerializeOptions = {}): string {
  const parts: string[] = [];

  doc.content.forEach((node) => parts.push(serializeNode(node, options)));

  return parts.join(options.joinWith ?? '');
}

/** Serializes one node and its subtree. */
export function serializeNode(node: DocNode, options: SerializeOptions = {}): string {
  if (isTextNode(node)) {
    return serializeText(node, options);
  }

  const rule = NODE_RULES.find(
    (candidate) => candidate.type === node.name && candidate.tag !== 'ul',
  );

  if (node.name === 'task_list') {
    return serializeTaskList(node, options);
  }

  if (node.name === 'task_item') {
    return serializeTaskItem(node, options);
  }

  if (node.name === 'bullet_list' || node.name === 'ordered_list') {
    return serializeList(node, options);
  }

  if (node.name === 'heading') {
    const level = Number(node.attr('level') ?? 1);

    // The level decides the tag, so the attributes are collected from the rule: an aligned
    // heading that lost its alignment on the way to HTML is a document that looks different after
    // a save and a load.
    return `<h${level}${serializeAttrs(node, rule?.attrs)}>${serializeChildren(node, options)}</h${level}>`;
  }

  if (!rule) {
    return serializeChildren(node, options);
  }

  const attrs = serializeAttrs(node, rule.attrs);

  if (node.isLeaf) {
    return attrs ? `<${rule.tag}${attrs} />` : `<${rule.tag} />`;
  }

  return `<${rule.tag}${attrs}>${serializeChildren(node, options)}</${rule.tag}>`;
}

/** Attributes written for a mark element. */
function markAttrs(mark: Mark, spec: Record<string, string> | undefined): string {
  if (!spec) {
    return '';
  }

  let result = '';

  for (const [attr, source] of Object.entries(spec)) {
    let value = mark.attrs[source];

    if (mark.type.name === 'link') {
      if (attr === 'target') {
        value = linkTargetValue(mark.attrs.target);
      } else if (attr === 'rel') {
        value = safeLinkRel(mark.attrs.target, mark.attrs.rel);
      }
    }

    if (value === undefined || value === null) {
      continue;
    }

    if (attr === 'href' && !urlPolicy.check(String(value))) {
      continue;
    }

    result += ` ${attr}="${escapeAttribute(String(value))}"`;
  }

  return result;
}

/**
 * The presentation of a block, written the way the live view writes it.
 *
 * A block carrying `align`, `indent` or a spacing attribute is rendered with those styles by the
 * view, so the markup has to say the same thing or a document saved as HTML and loaded again
 * would lose them. The declarations come from the rule the view itself uses rather than from a
 * second copy here: two writers of one contract drift, and the drift is invisible — the editor
 * looks right while `getHTML()` quietly drops a property.
 *
 * ```ts
 * const editor = new Editor({ extensions: [StarterKit] });
 * const block = editor.schema.node('paragraph', { align: 'center', indent: 2 });
 *
 * `${serializeAttrs(block, undefined)}`; // ' style="text-align: center" data-indent="2"'
 * ```
 */
function presentationAttrs(node: DocNode): string {
  if (!BLOCK_PRESENTATION.has(node.name)) {
    // Only the block types whose spec declares these attributes write them. A list or a code
    // block that happens to carry an `indent` in a document loaded from JSON is not one of this
    // editor's styled blocks, and the markup is read back by rules that would not look for it.
    return '';
  }

  let result = '';
  const style = blockPresentationStyle(node);
  const indent = indentationOf(node);

  if (style !== '') {
    result += ` style="${escapeAttribute(style)}"`;
  }

  if (indent !== null) {
    result += ` data-indent="${indent}"`;
  }

  return result;
}

/** Attributes written for a node element. */
function serializeAttrs(node: DocNode, spec: Record<string, string> | undefined): string {
  let result = '';

  if (node.name === 'ordered_list' && Number(node.attr('order') ?? 1) !== 1) {
    result += ` start="${escapeAttribute(String(node.attr('order')))}"`;
  }

  result += presentationAttrs(node);

  if (node.name === 'code_block' && node.attr('language')) {
    result += ` class="language-${escapeAttribute(String(node.attr('language')))}"`;
  }

  if (node.name === 'image') {
    for (const name of ['src', 'alt', 'title', 'width', 'height']) {
      const value = node.attrs[name];

      if (value === undefined || value === null || value === '') {
        continue;
      }

      if (name === 'src' && !urlPolicy.check(String(value))) {
        continue;
      }

      result += ` ${name}="${escapeAttribute(String(value))}"`;
    }

    return result;
  }

  if (!spec) {
    return result;
  }

  for (const [attr, source] of Object.entries(spec)) {
    const value = node.attrs[source];

    if (value === undefined || value === null) {
      continue;
    }

    result += ` ${attr}="${escapeAttribute(String(value))}"`;
  }

  return result;
}

/** Serializes the children of a node. */
function serializeChildren(node: DocNode, options: SerializeOptions): string {
  const parts: string[] = [];

  node.content.forEach((child) => parts.push(serializeNode(child, options)));

  return parts.join('');
}

/**
 * Blocks whose presentation is written into the markup.
 *
 * The block types whose spec declares the presentation attributes. Anything else is left alone,
 * and the set is the one the view rules describe rather than a second policy: a type that gains
 * the attributes will render them, and the markup has to follow.
 */
const BLOCK_PRESENTATION: ReadonlySet<string> = new Set(['heading', 'paragraph']);

/** Serializes a bullet or ordered list. */
function serializeList(node: DocNode, options: SerializeOptions): string {
  const tag = node.name === 'ordered_list' ? 'ol' : 'ul';
  const attrs =
    node.name === 'ordered_list' && Number(node.attr('order') ?? 1) !== 1
      ? ` start="${escapeAttribute(String(node.attr('order')))}"`
      : '';

  return `<${tag}${attrs}>${serializeChildren(node, options)}</${tag}>`;
}

/** Serializes one checklist entry. */
function serializeTaskItem(node: DocNode, options: SerializeOptions): string {
  const checked = node.attr('checked') === true ? ' checked' : '';

  return `<li data-type="task_item"><input type="checkbox" disabled${checked} />${serializeChildren(node, options)}</li>`;
}

/** Serializes a checklist; the checkbox is a node attribute, not text. */
function serializeTaskList(node: DocNode, options: SerializeOptions): string {
  return `<ul data-type="task_list">${serializeChildren(node, options)}</ul>`;
}

/** Serializes a text node with its marks applied innermost first. */
function serializeText(node: DocNode, options: SerializeOptions): string {
  let html = escapeText(node.rawText);

  for (const mark of node.markSet) {
    html = wrapMark(mark, html);
  }

  void options;

  return html;
}

/** Inline style for a mark that is written as a `span`. */
function spanStyle(mark: Mark): string {
  switch (mark.type.name) {
    case 'font_family': {
      const family = inlineStyleValue('font-family', mark.attrs.family);

      return family ? `font-family: ${escapeAttribute(family)}` : '';
    }
    case 'font_size': {
      const size = inlineStyleValue('font-size', mark.attrs.size);

      return size ? `font-size: ${escapeAttribute(size)}` : '';
    }
    case 'text_color': {
      const color = inlineStyleValue('color', mark.attrs.color);

      return color ? `color: ${escapeAttribute(color)}` : '';
    }
    default:
      return '';
  }
}

/** Wraps `html` in the element a mark is written as. */
function wrapMark(mark: Mark, html: string): string {
  const rule = MARK_RULES.find((candidate) => candidate.type === mark.type.name);
  const href = mark.type.name === 'link' ? String(mark.attrs.href ?? '') : '';

  if (mark.type.name === 'link' && !urlPolicy.check(href)) {
    return html;
  }

  if (!rule) {
    return html;
  }

  if (rule.tag === 'mark') {
    const color = inlineStyleValue('color', mark.attrs.color);

    return color
      ? `<mark style="background-color: ${escapeAttribute(color)}">${html}</mark>`
      : html;
  }

  if (rule.tag === 'span') {
    const style = spanStyle(mark);

    return style ? `<span style="${style}">${html}</span>` : html;
  }

  const attrs = markAttrs(mark, rule.attrs);

  return `<${rule.tag}${attrs}>${html}</${rule.tag}>`;
}

/** Re-exported so parsers can reuse the tag helpers. */
export { headingLevel };

/** Re-exported for adapters that build attributes by hand. */
export type { Attrs };
