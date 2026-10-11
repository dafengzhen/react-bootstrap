import type { Mark } from '../model/mark.ts';
import type { Node as DocNode } from '../model/node.ts';
import type { Schema } from '../schema/schema.ts';
import type { Attrs } from '../util/object.ts';

import {
  blockPresentationStyle,
  cssLength,
  indentationOf,
  inlineStyleValue,
  linkTargetValue,
  numberValue,
  safeLinkRel,
  spacingModelValue,
} from '../serialization/presentation.ts';
import { urlPolicy } from '../serialization/sanitize.ts';

export { blockPresentationStyle, indentationOf } from '../serialization/presentation.ts';

/**
 * DOM attributes a rule puts on an element.
 *
 * A `null` or `undefined` value removes the attribute, which is how a rule can say "only write
 * `start` when the list does not start at one".
 */
export type DOMAttrs = Record<string, boolean | null | number | string | undefined>;

/** The DOM rules of a schema: how its nodes and marks become elements. */
export interface DOMRules {
  /** Rules by mark name. */
  marks: Record<string, MarkDOMRule>;
  /** Rules by node name. */
  nodes: Record<string, NodeDOMRule>;
  /** What to do with an element no rule claims: unwrap it or drop it. */
  unknown: 'drop' | 'unwrap';
}

/** How one mark type is rendered and parsed. */
export interface MarkDOMRule {
  /** Attributes derived from the mark; `null` drops the attribute. */
  attrs?: (mark: Mark) => DOMAttrs;
  /** Hook that reads a mark's attributes back from an element, or rejects it. */
  parse?: (element: Element) => Attrs | null;
  /** Attribute names copied from the element onto the mark during parsing. */
  parseAttrs?: readonly string[];
  /** Tags accepted while parsing, when they differ from the rendered tag. */
  parseTags?: readonly string[];
  /** Tag the mark renders as; a function receives the mark. */
  tag: ((mark: Mark) => string) | string;
}

/**
 * How one node type is rendered and parsed.
 *
 * The view owns these rules: the core stays free of the DOM, and an extension that adds a node
 * contributes its rule through `addDOMRules`.
 */
export interface NodeDOMRule {
  /** Attributes derived from the node; `null` drops the attribute. */
  attrs?: (node: DocNode) => DOMAttrs;
  /** Hook that reads a node's attributes back from an element, or rejects it. */
  parse?: (element: Element) => Attrs | null;
  /** Attribute names copied from the element onto the node during parsing. */
  parseAttrs?: readonly string[];
  /** Tags accepted while parsing, when they differ from the rendered tag. */
  parseTags?: readonly string[];
  /** Tag the node renders as; a function receives the node. */
  tag: ((node: DocNode) => string) | string;
}

/**
 * Attributes a block renders its presentation with: `setTextAlign`, `indent` and the spacing
 * attributes of a paragraph are model attributes, so a document that holds them has to *look* like
 * it. Every value that reaches `style` is validated rather than interpolated, since a style
 * declaration is a place a document can carry code into the page: `align` is whitelisted,
 * `lineHeight` is a finite multiplier or a length matched against a strict pattern, and the margins
 * take pixels as a number or a length validated by `spacingModelValue`. `indent` becomes a
 * `data-indent` attribute rather than a `padding` declaration, so the host decides what a level
 * looks like. Declarations come from {@link blockPresentationStyle}, which the headless HTML
 * serializer reads too: what is shown and what is saved must agree.
 */
export function blockPresentation(node: DocNode): DOMAttrs {
  const attrs: DOMAttrs = {};
  const style = blockPresentationStyle(node);

  if (style !== '') {
    attrs.style = style;
  }

  const indent = indentationOf(node);

  if (indent !== null) {
    attrs['data-indent'] = indent;
  }

  return attrs;
}

/**
 * The DOM rules of the node and mark names the starter kit defines.
 *
 * Anything the schema does not know about is left to the caller through {@link DOMRules.unknown};
 * the defaults cover the semantic HTML that a document model of this shape maps onto.
 */
export function defaultDOMRules(): DOMRules {
  const nodes: Record<string, NodeDOMRule> = {
    blockquote: { tag: 'blockquote' },
    bullet_list: {
      parse: (element) =>
        element.hasAttribute('data-task-list') || element.querySelector(':scope > li[data-checked]')
          ? null
          : {},
      tag: 'ul',
    },
    code_block: {
      attrs: (node) => {
        const language = attrString(node.attrs, 'language');

        return language ? { 'data-language': language } : {};
      },
      parse: (element) => ({ language: element.getAttribute('data-language') }),
      parseTags: ['pre'],
      tag: 'pre',
    },
    doc: { tag: 'div' },
    heading: {
      attrs: (node) => blockPresentation(node),
      parse: (element) => {
        const level = Number(element.tagName.slice(1));
        const presentation = parseBlockPresentation(element);

        return Number.isFinite(level) && level >= 1 ? { level, ...presentation } : null;
      },
      parseTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      tag: (node) => `h${Number(node.attr('level') ?? 1)}`,
    },
    horizontal_rule: { tag: 'hr' },
    list_item: {
      parse: (element) =>
        element.hasAttribute('data-task-item') || element.hasAttribute('data-checked') ? null : {},
      tag: 'li',
    },
    ordered_list: {
      attrs: (node) => {
        const order = Number(node.attr('order') ?? 1);

        return order === 1 ? {} : { start: order };
      },
      parse: (element) => ({ order: Number(element.getAttribute('start') ?? 1) }),
      tag: 'ol',
    },
    paragraph: {
      attrs: (node) => blockPresentation(node),
      parse: (element) => parseBlockPresentation(element),
      tag: 'p',
    },
    table: { tag: 'table' },
    table_cell: {
      attrs: (node) => ({
        colspan: Number(node.attr('colspan') ?? 1),
        rowspan: Number(node.attr('rowspan') ?? 1),
      }),
      parse: (element) => ({
        colspan: Math.max(1, Math.floor(Number(element.getAttribute('colspan')) || 1)),
        rowspan: Math.max(1, Math.floor(Number(element.getAttribute('rowspan')) || 1)),
      }),
      parseTags: ['td', 'th'],
      tag: 'td',
    },
    table_row: { tag: 'tr' },
    task_item: {
      attrs: (node) => ({
        'data-checked': String(node.attr('checked') === true),
        'data-task-item': '',
      }),
      parse: (element) =>
        element.hasAttribute('data-task-item') || element.hasAttribute('data-checked')
          ? { checked: element.getAttribute('data-checked') === 'true' }
          : null,
      parseTags: ['li'],
      tag: 'li',
    },
    task_list: {
      attrs: () => ({ 'data-task-list': '' }),
      parse: (element) =>
        element.hasAttribute('data-task-list') || element.querySelector(':scope > li[data-checked]')
          ? {}
          : null,
      parseTags: ['ul'],
      tag: 'ul',
    },
  };

  const marks: Record<string, MarkDOMRule> = {
    bold: { parseTags: ['b', 'strong'], tag: 'strong' },
    font_family: {
      attrs: (mark) =>
        styleAttr({
          'font-family': inlineStyleValue('font-family', mark.attrs.family),
        }),
      parse: (element) => {
        const family = inlineStyleValue('font-family', styleValue(element, 'font-family'));

        return family ? { family } : null;
      },
      parseTags: ['span'],
      tag: 'span',
    },
    font_size: {
      attrs: (mark) => styleAttr({ 'font-size': inlineStyleValue('font-size', mark.attrs.size) }),
      parse: (element) => {
        const size = inlineStyleValue('font-size', styleValue(element, 'font-size'));

        return size ? { size } : null;
      },
      parseTags: ['span'],
      tag: 'span',
    },
    highlight: {
      attrs: (mark) =>
        styleAttr({ 'background-color': inlineStyleValue('color', mark.attrs.color) }),
      parse: (element) => {
        const color = inlineStyleValue('color', styleValue(element, 'background-color'));

        return color ? { color } : null;
      },
      parseTags: ['mark', 'span'],
      tag: 'mark',
    },
    inline_code: { tag: 'code' },
    italic: { parseTags: ['em', 'i'], tag: 'em' },
    link: {
      attrs: (mark) => {
        const target = linkTargetValue(mark.attrs.target);

        return {
          href: attrString(mark.attrs, 'href'),
          // A link that opens a new browsing context hands the new document a handle on this one
          // unless `rel` says otherwise, so the safe value is written whenever the mark asks for
          // `_blank` without a `rel` of its own.
          rel: safeLinkRel(target, mark.attrs.rel),
          target,
          title: attrString(mark.attrs, 'title'),
        };
      },
      parse: (element) => {
        const href = element.getAttribute('href');

        // An element whose destination the policy refuses is not read as a link at all. The DOM
        // parser normally cleans the markup before this, so this is the second line, for a caller
        // feeding this rule an element it built.
        if (!href || urlPolicy.sanitize(href) === '') {
          return null;
        }

        return {
          href,
          rel: element.getAttribute('rel'),
          target: element.getAttribute('target'),
          title: element.getAttribute('title'),
        };
      },
      parseTags: ['a'],
      tag: 'a',
    },
    strike: { parseTags: ['del', 's', 'strike'], tag: 's' },
    subscript: { tag: 'sub' },
    superscript: { tag: 'sup' },
    text_color: {
      attrs: (mark) => styleAttr({ color: inlineStyleValue('color', mark.attrs.color) }),
      parse: (element) => {
        const color = inlineStyleValue('color', styleValue(element, 'color'));

        return color ? { color } : null;
      },
      parseTags: ['span'],
      tag: 'span',
    },
    underline: { tag: 'u' },
  };

  return { marks, nodes, unknown: 'unwrap' };
}

/** Merges `extra` into `rules`, which the caller owns. */
export function mergeDOMRules(rules: DOMRules, extra: Partial<DOMRules>): DOMRules {
  return {
    marks: { ...rules.marks, ...extra.marks },
    nodes: { ...rules.nodes, ...extra.nodes },
    unknown: extra.unknown ?? rules.unknown,
  };
}

/**
 * Presentation attributes read back from an element.
 *
 * The counterpart of {@link blockPresentation}, so a block that was rendered and then parsed — a
 * paste, a `setHTML`, a round trip through the DOM — comes back with the attributes it had. A
 * declaration the rules do not produce is ignored, and a unitless `line-height` comes back as the
 * multiplier a number means while `1.5em` comes back as the length it is.
 */
export function parseBlockPresentation(element: Element): Attrs {
  const attrs: Attrs = {};
  const align = styleValue(element, 'text-align');

  if (align !== null && ALIGN_VALUES.has(align.toLowerCase())) {
    attrs.align = align.toLowerCase();
  }

  const lineHeight = styleValue(element, 'line-height');

  if (lineHeight !== null) {
    const number = numberValue(lineHeight);

    if (number !== null) {
      attrs.lineHeight = number;
    } else if (cssLength(lineHeight) !== null) {
      attrs.lineHeight = lineHeight;
    }
  }

  for (const [name, property] of [
    ['marginTop', 'margin-top'],
    ['marginBottom', 'margin-bottom'],
  ] as const) {
    const value = styleValue(element, property);

    if (value !== null) {
      const spacing = spacingModelValue(value);

      if (spacing !== null) {
        attrs[name] = spacing;
      }
    }
  }

  const indent = Number(element.getAttribute('data-indent') ?? '0');

  if (Number.isInteger(indent) && indent > 0) {
    attrs.indent = Math.min(indent, MAX_INDENT);
  }

  return attrs;
}

/** Alignment values accepted while parsing a block. */
const ALIGN_VALUES: ReadonlySet<string> = new Set(['center', 'justify', 'left', 'right']);

/** Largest indentation level a document may ask for. */
const MAX_INDENT = 8;

/**
 * Rules of `schema`, with defaults for every type without a rule of its own.
 *
 * A schema that brings its own nodes — the media extension, or anything a consumer adds — still has
 * to be parseable, or `setHTML` and a paste would drop the markup those nodes render as. Filling
 * the gaps keeps a rule set a matter of *how* a node is rendered, never of whether it survives a
 * round trip through HTML.
 */
export function rulesForSchema(schema: Schema, rules: DOMRules = defaultDOMRules()): DOMRules {
  const nodes: Record<string, NodeDOMRule> = { ...rules.nodes };
  const marks: Record<string, MarkDOMRule> = { ...rules.marks };

  for (const name of Object.keys(schema.nodes)) {
    if (name === 'text' || nodes[name]) {
      continue;
    }

    // An unknown leaf renders as the HTML element that means the same thing — `img` for an image —
    // and any other node as a plain element of its own name, so a node of a custom schema shows up
    // and parses back instead of throwing.
    const tag = FALLBACK_TAGS.get(name) ?? name.replaceAll('_', '-');

    if (FALLBACK_PARSERS.has(tag)) {
      nodes[name] = { parse: FALLBACK_PARSERS.get(tag), tag };
      continue;
    }

    nodes[name] = { tag };
  }

  for (const name of Object.keys(schema.marks)) {
    if (!marks[name]) {
      marks[name] = { tag: 'span' };
    }
  }

  return { marks, nodes, unknown: rules.unknown };
}

/**
 * Tags a node with no rule of its own renders as.
 *
 * An image is the case that matters: a browser writes `<img>` for it, and a consumer adding the
 * media extension but no rules would get markup the parser cannot read back.
 */
const FALLBACK_TAGS: ReadonlyMap<string, string> = new Map([['image', 'img']]);

/**
 * How a fallback tag is read back into node attributes.
 *
 * A rule's `attrs` renders a *document node* into attributes, so it cannot be used for parsing;
 * reading an element is `parse`. An `<img>` needs one because its source, text alternative and size
 * are the whole node — without them the schema sees an image with no source and drops it.
 */
const FALLBACK_PARSERS: ReadonlyMap<string, (element: Element) => Attrs> = new Map([
  [
    'img',
    (element) => {
      // The source is cleaned once and reused, so the element and the attribute it is built from
      // cannot disagree.
      const src = urlPolicy.sanitize(element.getAttribute('src') ?? '');

      if (src === '') {
        return {};
      }

      return {
        alt: element.getAttribute('alt'),
        height: finiteAttribute(element, 'height'),
        src,
        title: element.getAttribute('title'),
        width: finiteAttribute(element, 'width'),
      };
    },
  ],
]);

/** Tag a rule renders as, for `value`. */
export function ruleTag<T>(tag: ((value: T) => string) | string, value: T): string {
  return typeof tag === 'function' ? tag(value) : tag;
}

/** Builds the `style` attribute of an element from declarations. */
export function styleAttr(
  declarations: Record<string, null | number | string | undefined>,
): DOMAttrs {
  const parts: string[] = [];

  for (const [property, value] of Object.entries(declarations)) {
    if (value !== null && value !== undefined && value !== '') {
      parts.push(`${property}: ${String(value)}`);
    }
  }

  return parts.length > 0 ? { style: parts.join('; ') } : {};
}

/** Reads a CSS declaration value out of an element's `style` attribute. */
export function styleValue(element: Element, property: string): null | string {
  const style = element.getAttribute('style');

  if (!style) {
    return null;
  }

  for (const declaration of style.split(';')) {
    const separator = declaration.indexOf(':');

    if (separator < 0) {
      continue;
    }

    if (declaration.slice(0, separator).trim().toLowerCase() === property) {
      return declaration.slice(separator + 1).trim();
    }
  }

  return null;
}

/** Attribute value of an attribute list, as a string, or `null`. */
function attrString(attrs: Attrs, name: string): null | string {
  const value = attrs[name];

  return value === null || value === undefined ? null : String(value);
}

/** Numeric attribute of `element`, or `null` when it is absent or not a number. */
function finiteAttribute(element: Element, name: string): null | number {
  const value = element.getAttribute(name);

  if (value === null || value.trim() === '') {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}
