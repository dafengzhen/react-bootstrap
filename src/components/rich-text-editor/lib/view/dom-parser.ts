import type { MarkType } from '../model/mark-type.ts';
import type { Mark } from '../model/mark.ts';
import type { NodeType } from '../model/node-type.ts';
import type { Node as DocNode } from '../model/node.ts';
import type { Schema } from '../schema/schema.ts';
import type { Attrs } from '../util/object.ts';
import type { DOMRules, MarkDOMRule, NodeDOMRule } from './dom-rules.ts';

import { Fragment } from '../model/fragment.ts';
import { htmlPolicy, urlPolicy } from '../serialization/sanitize.ts';
import { ErrorCode, viewError } from '../util/errors.ts';
import { defaultDOMRules, mergeDOMRules, rulesForSchema, ruleTag } from './dom-rules.ts';

/** Node type number of an element in the DOM. */
const ELEMENT_NODE = 1;

/** Node type number of a text node in the DOM. */
const TEXT_NODE = 3;

/** A rule that claims an element, with the node type it builds. */
interface NodeClaim {
  /** Rule that accepted the element. */
  rule: NodeDOMRule;
  /** Node type the rule builds. */
  type: NodeType;
}

/** Everything one parse needs, resolved once. */
interface ParseContext {
  /** Mark types of the schema, in declaration order. */
  markTypes: readonly MarkType[];
  /** Rules in effect, with the schema defaults filled in. */
  rules: DOMRules;
  /** Schema the parsed nodes are built from. */
  schema: Schema;
}

/** Line endings of `text` as `\n`, whichever dialect the source used. */
export function normalizeLineEndings(text: string): string {
  return text.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
}

/**
 * Parses a DOM element into document nodes.
 *
 * A claimed element is parsed with its children as its content, so a rendered block comes back as
 * that block. An unclaimed one is handled by {@link DOMRules.unknown}; a rendered document's root
 * parses into the document's content.
 */
export function parseDOMElement(element: Element, schema: Schema, rules?: DOMRules): Fragment {
  const context = parseContext(schema, rules);

  return Fragment.from(parseElement(element, context, null, []));
}

/**
 * Sanitizes an HTML string and parses it into document nodes.
 *
 * External HTML is never trusted, so it goes through {@link htmlPolicy.sanitize} first. Content not
 * allowed at the top level is wrapped in the block type the content model asks for; markup with no
 * content becomes `Fragment.empty`.
 *
 * @param rules - extra DOM rules, merged over the defaults @param domDocument - document the
 * detached container is built in
 */
export function parseHTML(
  html: string,
  schema: Schema,
  rules?: DOMRules,
  domDocument?: Document,
): Fragment {
  const document = resolveDocument(domDocument);
  const container = document.createElement('div');

  container.innerHTML = htmlPolicy.sanitize(html);

  return parseChildren(container, parseContext(schema, rules), schema.topNodeType, []);
}

/**
 * Parses plain text into a fragment: blank lines separate blocks.
 *
 * Every block becomes a paragraph and a single newline stays a character, so a paste keeps its line
 * breaks without block structure. The clipboard has no one dialect — Windows writes `\r\n`, a
 * browser `\n`, an older Mac `\r` — so the text is normalized to `\n` first.
 */
export function parsePlainText(text: string, schema: Schema): Fragment {
  const type = textblockType(schema);

  if (!type) {
    return Fragment.empty;
  }

  const normalized = normalizeLineEndings(text);
  const paragraphs: DocNode[] = [];

  for (const block of normalized.split(/\n{2,}/)) {
    if (block.length > 0) {
      paragraphs.push(type.create(null, schema.text(block)));
    }
  }

  return Fragment.from(paragraphs);
}

/** Content of `content`, shaped so that a node of type `type` can hold it. */
function adaptContent(
  content: Fragment,
  type: NodeType,
  context: ParseContext,
  seen = new Set<NodeType>(),
): Fragment {
  if (allowsText(type)) {
    return unwrapBlocks(content);
  }

  return content.children.some(isInlineNode)
    ? wrapInlineRuns(content, type, context, seen)
    : content;
}

/** Marks a text node inside `type` may carry. */
function allowedMarks(type: NodeType, marks: readonly Mark[]): readonly Mark[] {
  if (!allowsText(type)) {
    return marks;
  }

  return marks.filter((mark) => type.allowsMarkType(mark.type.name));
}

/** Whether a node of `type` may hold characters. */
function allowsText(type: NodeType): boolean {
  return type.contentMatch.allowedTypes.some((candidate) => candidate.isText);
}

/** Attributes a rule reads from an element, or `null` when it rejects the element. */
function attrsForRule(rule: MarkDOMRule | NodeDOMRule, element: Element): Attrs | null {
  const attrs = rule.parse ? rule.parse(element) : copyAttrs(rule.parseAttrs, element);

  return attrs ? safeAttrs(attrs) : null;
}

/** Builds the node a claimed element stands for, or `null` when it holds nothing. */
function buildNode(
  type: NodeType,
  attrs: Attrs,
  element: Element,
  context: ParseContext,
  marks: readonly Mark[],
): DocNode | null {
  if (type.isLeaf) {
    return type.create(attrs, undefined);
  }

  const content = parseChildren(element, context, type, marks);

  // An element that holds nothing is kept only when its content model allows it, so an empty
  // paragraph stays and an empty list is dropped.
  if (content.size === 0 && !type.contentMatch.allowsEmpty) {
    return null;
  }

  return type.create(attrs, content);
}

/**
 * Rules that claim `tag`, in the order they are tried.
 *
 * A rule claims a tag through `parseTags`, or through the tag it renders. A rule accepting a tag
 * other than it renders wins, because that claim is deliberate — this is what makes `b`, `i`, `h2`
 * and `del` parse as bold, italic, heading and strike. Otherwise `Object.keys(schema.nodes)` order
 * decides, keeping `ul`/`li` a bullet list.
 */
function claimsFor(tag: string, context: ParseContext, includeTop: boolean): NodeClaim[] {
  const deliberate: NodeClaim[] = [];
  const guessed: NodeClaim[] = [];

  for (const name of Object.keys(context.schema.nodes)) {
    const type = context.schema.nodes[name];

    if (!type || type.isText) {
      continue;
    }

    // Inside content the top node type is never rebuilt, so an element rendering like it is a
    // wrapper.
    if (!includeTop && type === context.schema.topNodeType) {
      continue;
    }

    const rule = context.rules.nodes[name];

    if (!rule) {
      continue;
    }

    const rendered = renderedNodeTag(rule, type);
    const tags = rule.parseTags ?? (rendered === null ? [] : [rendered]);

    if (!tags.some((candidate) => candidate.toLowerCase() === tag)) {
      continue;
    }

    const claim = { rule, type };

    if (rule.parseTags && rendered !== null && rendered.toLowerCase() !== tag) {
      deliberate.push(claim);
    } else {
      guessed.push(claim);
    }
  }

  return [...deliberate, ...guessed];
}

/** Order the renderer writes marks in, so a parse produces the same mark sets. */
function compareMarks(a: Mark, b: Mark): number {
  return a.type.name.localeCompare(b.type.name);
}

/** Copies the attribute names a rule declares, and nothing else. */
function copyAttrs(names: readonly string[] | undefined, element: Element): Attrs {
  const attrs: Attrs = {};

  for (const name of names ?? []) {
    const value = element.getAttribute(name);

    if (value !== null) {
      attrs[name] = value;
    }
  }

  return attrs;
}

/** Text and inline nodes inside `node`, with every block wrapper dropped. */
function inlineParts(node: DocNode): DocNode[] {
  const parts: DocNode[] = [];

  node.forEach((child) => {
    if (isInlineNode(child)) {
      parts.push(child);
    } else if (!child.isLeaf) {
      parts.push(...inlineParts(child));
    }
  });

  return parts;
}

/** Whether a node lives in inline content rather than in a block of its own. */
function isInlineNode(node: DocNode): boolean {
  return node.isText || node.isInline;
}

/** Whether the parser ignores an element together with everything inside it. */
function isSkippedTag(tag: string): boolean {
  switch (tag) {
    case 'head':
    case 'meta':
    case 'noscript':
    case 'script':
    case 'style':
    case 'title':
      return true;
    default:
      return false;
  }
}

/** Tags a mark rule accepts, lowercased. */
function markRuleTags(rule: MarkDOMRule, type: MarkType): string[] {
  const tags =
    rule.parseTags ??
    (typeof rule.tag === 'string' ? [rule.tag] : [ruleTag(rule.tag, type.create())]);

  return tags.map((tag) => tag.toLowerCase());
}

/** Marks an element carries, in schema declaration order. */
function marksOf(context: ParseContext, element: Element): Mark[] {
  const tag = element.tagName.toLowerCase();
  const marks: Mark[] = [];

  for (const type of context.markTypes) {
    const rule = context.rules.marks[type.name];

    if (!rule || !markRuleTags(rule, type).includes(tag)) {
      continue;
    }

    const attrs = attrsForRule(rule, element);

    if (attrs) {
      marks.push(type.create(attrs));
    }
  }

  return marks;
}

/** Nodes one DOM child contributes, in document order. */
function parseChildNode(
  node: ChildNode,
  context: ParseContext,
  parentType: NodeType,
  marks: readonly Mark[],
): DocNode[] {
  if (node.nodeType === ELEMENT_NODE) {
    return parseElement(node as Element, context, parentType, marks);
  }

  if (node.nodeType !== TEXT_NODE) {
    return [];
  }

  const text = node.nodeValue ?? '';

  // Whitespace between two blocks is indentation of the markup, not content.
  if (text.length === 0 || (!allowsText(parentType) && text.trim().length === 0)) {
    return [];
  }

  return [context.schema.text(text, sortMarks(allowedMarks(parentType, marks)))];
}

/** Content of `parent`, shaped so that a node of type `parentType` can hold it. */
function parseChildren(
  parent: Element,
  context: ParseContext,
  parentType: NodeType,
  marks: readonly Mark[],
): Fragment {
  const nodes: DocNode[] = [];
  const children = parent.childNodes;

  for (let index = 0; index < children.length; index++) {
    const child = children[index];

    if (child) {
      nodes.push(...parseChildNode(child, context, parentType, marks));
    }
  }

  return adaptContent(Fragment.from(nodes), parentType, context);
}

/** Parse state of one call: the rules in effect and the types they build. */
function parseContext(schema: Schema, rules?: DOMRules): ParseContext {
  const merged = rules ? mergeDOMRules(defaultDOMRules(), rules) : defaultDOMRules();

  return { markTypes: Object.values(schema.marks), rules: rulesForSchema(schema, merged), schema };
}

/**
 * Nodes `element` contributes to the content of `parentType`.
 *
 * A `null` parent type marks the root of a parse, where the top node type may claim the element and
 * an unclaimed one is a container.
 */
function parseElement(
  element: Element,
  context: ParseContext,
  parentType: NodeType | null,
  marks: readonly Mark[],
): DocNode[] {
  const tag = element.tagName.toLowerCase();

  if (isSkippedTag(tag)) {
    return [];
  }

  const inherited = [...marks, ...marksOf(context, element)];
  const container = parentType ?? context.schema.topNodeType;

  // A hard break is a newline where characters are allowed and nothing anywhere else: a `<br>`
  // between two blocks does not open a block.
  if (tag === 'br') {
    const newline = sortMarks(allowedMarks(container, inherited));

    return allowsText(container) ? [context.schema.text('\n', newline)] : [];
  }

  for (const claim of claimsFor(tag, context, parentType === null)) {
    const attrs = attrsForRule(claim.rule, element);

    if (!attrs) {
      continue;
    }

    const node = buildNode(claim.type, attrs, element, context, inherited);

    if (!node) {
      continue;
    }

    if (parentType === null && claim.type === context.schema.topNodeType) {
      return [...node.content.children];
    }

    return [node];
  }

  if (context.rules.unknown === 'drop') {
    return [];
  }

  return [...parseChildren(element, context, container, inherited).children];
}

/** Tag a node rule renders for a default instance of `type`, or `null`. */
function renderedNodeTag(rule: NodeDOMRule, type: NodeType): null | string {
  return typeof rule.tag === 'string' ? rule.tag : ruleTag(rule.tag, type.create());
}

/** Document the parser builds elements in. */
function resolveDocument(domDocument?: Document): Document {
  const document: Document | undefined = domDocument ?? globalThis.document;

  if (!document) {
    throw viewError(
      ErrorCode.DOM_UNAVAILABLE,
      'Parsing HTML needs a DOM document; pass one or run in a browser',
    );
  }

  return document;
}

/**
 * Attributes without the ones whose URL {@link urlPolicy} refuses.
 *
 * The values come from a real element, so the HTML parser has already decoded any character
 * references.
 */
function safeAttrs(attrs: Attrs): Attrs | null {
  for (const name of ['href', 'src']) {
    const value = attrs[name];

    if (typeof value === 'string' && value.trim().length > 0 && !urlPolicy.check(value)) {
      return null;
    }
  }

  return attrs;
}

/** Marks in the canonical order the renderer writes them in. */
function sortMarks(marks: readonly Mark[]): readonly Mark[] {
  return marks.length < 2 ? marks : [...marks].sort(compareMarks);
}

/** Block type a created paragraph is built from. */
function textblockType(schema: Schema): NodeType | null {
  const paragraph = schema.nodes.paragraph;

  if (paragraph && !paragraph.isLeaf) {
    return paragraph;
  }

  return schema.textblocks[0] ?? null;
}

/** Content with every block wrapper replaced by the inline content it holds. */
function unwrapBlocks(content: Fragment): Fragment {
  const parts: DocNode[] = [];

  for (const child of content.children) {
    if (isInlineNode(child)) {
      parts.push(child);
    } else if (!child.isLeaf) {
      parts.push(...inlineParts(child));
    }
  }

  return parts.length === content.childCount ? content : Fragment.from(parts);
}

/** Content of a block, with every run of inline content wrapped in a block. */
function wrapInlineRuns(
  content: Fragment,
  type: NodeType,
  context: ParseContext,
  seen: Set<NodeType>,
): Fragment {
  const result: DocNode[] = [];
  let run: DocNode[] = [];

  const flush = (): void => {
    if (run.length > 0) {
      result.push(...wrapRun(run, type, context, seen));
      run = [];
    }
  };

  for (const child of content.children) {
    if (isInlineNode(child)) {
      run.push(child);
    } else {
      flush();
      result.push(child);
    }
  }

  flush();

  return Fragment.from(result);
}

/**
 * Block a run of inline content is wrapped in.
 *
 * Characters are content of a textblock, never a block of their own, so a textblock the content
 * model accepts is preferred over its default type: a document and a blockquote both wrap loose
 * text in a paragraph. A model that cannot hold a textblock — a list — falls back to its default
 * type and wraps again lower down.
 */
function wrapperFor(type: NodeType, context: ParseContext): NodeType | null {
  const paragraph = context.schema.nodes.paragraph;

  if (paragraph && !paragraph.isLeaf && type.contentMatch.allows(paragraph)) {
    return paragraph;
  }

  const block = context.schema.textblocks.find((candidate) => type.contentMatch.allows(candidate));

  if (block) {
    return block;
  }

  const preferred = type.contentMatch.defaultType;

  return preferred && !preferred.isLeaf ? preferred : textblockType(context.schema);
}

/** Wraps one run of inline content in the block type the content model asks for. */
function wrapRun(
  run: readonly DocNode[],
  type: NodeType,
  context: ParseContext,
  seen: Set<NodeType>,
): DocNode[] {
  const wrapper = wrapperFor(type, context);

  // A schema whose content models only point at each other has no block to wrap the run in, and
  // neither has one already wrapping it higher up.
  if (!wrapper || seen.has(wrapper)) {
    return [...run];
  }

  const chain = new Set(seen);

  chain.add(wrapper);

  return [wrapper.create(null, adaptContent(Fragment.from(run), wrapper, context, chain))];
}
