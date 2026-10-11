import type { Node as DocNode } from '../model/node.ts';
import type { TextNode } from '../model/text-node.ts';
import type { DecorationSet } from './decoration.ts';
import type { DOMRules } from './dom-rules.ts';
import type { DOMElement, DOMNode, DOMText } from './dom-types.ts';
import type { EditorLocale } from './locale.ts';
import type { NodeView } from './node-view.ts';

import { urlPolicy } from '../serialization/sanitize.ts';
import { inlineAttrsAt } from './decoration.ts';
import { ruleTag } from './dom-rules.ts';
import { resolveLocale } from './locale.ts';

export type { DOMElement, DOMNode, DOMText } from './dom-types.ts';

/** Everything the renderer needs that outlives a single call. */
export interface RenderContext {
  /** Decorations to apply while rendering. */
  decorations?: DecorationSet;
  /** The DOM document to create nodes in. */
  document: Document;
  /** Identity maps, shared with the view. */
  maps: ViewMaps;
  /** Builds the view of a node, when the view has registered one. */
  nodeView?: (node: DocNode) => NodeView | null;
  /** The DOM rules to render with. */
  rules: DOMRules;
}

/** One rendered piece of a document text node. */
export interface TextSegment {
  /** DOM text node holding the characters. */
  dom: DOMText;
  /** Offset of the segment inside the document text node. */
  start: number;
}

/** Where the DOM the renderer produced is remembered. */
export interface ViewMaps {
  /** Element whose children mirror a document node's content. */
  contentDOM: WeakMap<DocNode, DOMElement>;
  /** DOM node that renders a document node. */
  docToDom: WeakMap<DocNode, DOMNode>;
  /** Document node a DOM node renders. */
  domToDoc: WeakMap<DOMNode, DocNode>;
  /** Rendered pieces of a text node, in order. */
  textSegments: WeakMap<DocNode, TextSegment[]>;
}

/**
 * Applies attributes to an element, dropping the ones set to `null` or `false`.
 *
 * A URL is re-checked here, last before the DOM, so that an unsafe URL never becomes a live
 * attribute however it got here: the model applies {@link urlPolicy} during normalization, but
 * custom node views, custom rules and documents built against another schema all reach this sink
 * directly.
 */
export function applyAttrs(element: DOMElement, attrs: Record<string, unknown>): void {
  for (const [name, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) {
      element.removeAttribute(name);
      continue;
    }

    if (!urlAttributeMayBeUsed(name, value)) {
      continue;
    }

    element.setAttribute(name, value === true ? '' : String(value));
  }
}

/**
 * Whether `value` may be written as the attribute `name`.
 *
 * Only URL-carrying attributes are checked, and `''` passes: an image rendered without a source has
 * no URL rather than a dangerous one. `srcset` candidates are checked one by one, since refusing
 * the whole attribute over one bad candidate would drop a picture whose other sources are fine.
 */
function urlAttributeMayBeUsed(name: string, value: unknown): boolean {
  const attribute = name.toLowerCase();

  if (!URL_ATTRIBUTES.has(attribute)) {
    return true;
  }

  const text = String(value);

  if (text.trim() === '') {
    return true;
  }

  if (attribute === 'srcset') {
    return text
      .split(',')
      .every((candidate) => urlPolicy.check(candidate.trim().split(/\s+/)[0] ?? ''));
  }

  return urlPolicy.check(text);
}

/**
 * URL attributes a rule may render into; deliberately closed, so a host rendering one through a
 * custom node view owns it.
 */
const URL_ATTRIBUTES: ReadonlySet<string> = new Set([
  'action',
  'cite',
  'data',
  'formaction',
  'href',
  'poster',
  'src',
  'srcset',
  'xlink:href',
]);

/** Creates the identity maps of a view. */
export function createViewMaps(): ViewMaps {
  return {
    contentDOM: new WeakMap(),
    docToDom: new WeakMap(),
    domToDoc: new WeakMap(),
    textSegments: new WeakMap(),
  };
}

/** Renders the children of `node` into `element`. */
export function renderContent(
  element: DOMElement,
  node: DocNode,
  context: RenderContext,
  contentStart: number,
): void {
  let offset = 0;

  for (let index = 0; index < node.childCount; index++) {
    const child = node.child(index);
    const childStart = contentStart + offset;

    offset += child.nodeSize;

    const rendered = renderNode(child, context, childStart);

    if (rendered !== element) {
      element.append(rendered);
    }
  }
}

/**
 * Builds the editable root of a document: the document's own content element, so its children are
 * the top level blocks and the browser's selection offsets line up with document positions.
 *
 * The role, multi-line state, name and editable state are written here because that is the control
 * a screen reader announces, and a `div` with `contenteditable` carries none of them:
 * `aria-multiline` for an area that accepts line breaks, `aria-label` from `locale.label` (omitted
 * when a host names the control itself with `null`), and `aria-readonly` because
 * `contenteditable="false"` is only a rendering state.
 */
export function renderDocumentRoot(
  doc: DocNode,
  context: RenderContext,
  options: {
    editable: boolean;
    /** Copy the root carries; see `locale.ts` for what each slot means. */
    locale?: EditorLocale;
    role?: string;
  } = { editable: true },
): DOMElement {
  const root = context.document.createElement('div');
  const locale = resolveLocale(options.locale);

  root.className = 'rt-editor';
  root.setAttribute('contenteditable', options.editable ? 'true' : 'false');
  root.setAttribute('role', options.role ?? 'textbox');
  // Without this a rich text area, which accepts line breaks, is described as a single line field.
  root.setAttribute('aria-multiline', 'true');
  // The name comes from the host through `locale.label`; `null` leaves the attribute off.
  if (locale.label !== null) {
    root.setAttribute('aria-label', locale.label);
  }

  if (!options.editable) {
    // The read-only state is announced from the ARIA attribute, not from `contenteditable`.
    root.setAttribute('aria-readonly', 'true');
  }

  if (locale.translate !== null) {
    root.setAttribute('translate', locale.translate);
  }

  root.style.whiteSpace = 'pre-wrap';
  root.style.overflowWrap = 'break-word';

  // The view keeps the placeholder in step as the document changes.
  if (locale.placeholder && doc.textContent.length === 0) {
    applyAttrs(root, { 'data-placeholder': locale.placeholder });
  }

  remember(context, doc, root);
  renderContent(root, doc, context, 0);

  return root;
}

/**
 * Renders one node with its content.
 *
 * `ownStart` follows the core's position model — a block's opening token or a text node's first
 * character — so a block's content begins one position later.
 */
export function renderNode(node: DocNode, context: RenderContext, ownStart: number): DOMNode {
  if (node.isText) {
    return renderText(node as TextNode, context, ownStart);
  }

  const custom = context.nodeView?.(node);

  if (custom) {
    return renderNodeView(node, custom, context, ownStart);
  }

  const rule = context.rules.nodes[node.name];
  const tag = rule ? ruleTag(rule.tag, node) : node.name.replaceAll('_', '-');
  const element = context.document.createElement(tag);
  const attrs = {
    ...rule?.attrs?.(node),
    ...nodeDecorationAttrs(context, ownStart, ownStart + node.nodeSize),
  };

  applyAttrs(element, attrs);
  remember(context, node, element);

  if (!node.isLeaf) {
    renderContent(element, node, context, ownStart + 1);
  }

  return element;
}

/** Attributes of every node decoration covering `[from, to)`. */
function nodeDecorationAttrs(
  context: RenderContext,
  from: number,
  to: number,
): Record<string, unknown> {
  return (context.decorations?.between(from, to, 'node') ?? []).reduce<Record<string, unknown>>(
    (attrs, decoration) => ({ ...attrs, ...decoration.attrs }),
    {},
  );
}

/** Records the identity of a rendered node and its content element. */
function remember(
  context: RenderContext,
  node: DocNode,
  dom: DOMNode,
  content: DOMElement = dom as DOMElement,
): void {
  context.maps.docToDom.set(node, dom);
  context.maps.domToDoc.set(dom, node);
  context.maps.contentDOM.set(node, content);
}

/** Renders a node through the `NodeView` an extension registered for it. */
function renderNodeView(
  node: DocNode,
  view: NodeView,
  context: RenderContext,
  ownStart: number,
): DOMNode {
  const content = view.contentDOM ?? view.dom;

  applyAttrs(view.dom, nodeDecorationAttrs(context, ownStart, ownStart + node.nodeSize));
  remember(context, node, view.dom, content);

  if (view.contentDOM && !node.isLeaf) {
    renderContent(view.contentDOM, node, context, ownStart + 1);
  } else if (!view.contentDOM && !node.isLeaf) {
    renderContent(view.dom, node, context, ownStart + 1);
  }

  return view.dom;
}

/**
 * Renders a text node, split at decoration boundaries and wrapped in its marks.
 *
 * `ownStart` is the first character's position, which is what inline decorations are matched
 * against.
 */
function renderText(node: TextNode, context: RenderContext, ownStart: number): DOMNode {
  const end = ownStart + node.text.length;
  const points = new Set<number>([0, node.text.length]);

  for (const decoration of context.decorations?.between(ownStart, end, 'inline') ?? []) {
    points.add(Math.max(0, Math.min(node.text.length, decoration.from - ownStart)));
    points.add(Math.max(0, Math.min(node.text.length, decoration.to - ownStart)));
  }

  const boundaries = [...points].sort((a, b) => a - b);
  const segments: TextSegment[] = [];
  const parts: DOMNode[] = [];

  for (let index = 0; index < boundaries.length - 1; index++) {
    const from = boundaries[index]!;
    const to = boundaries[index + 1]!;

    if (from === to) {
      continue;
    }

    const text = context.document.createTextNode(node.text.slice(from, to));

    segments.push({ dom: text, start: from });
    parts.push(wrapMarks(text, node, context, inlineAttrsAt(context.decorations, ownStart + from)));
  }

  context.maps.textSegments.set(node, segments);
  context.maps.docToDom.set(node, parts[0] as DOMNode);

  for (const segment of segments) {
    context.maps.domToDoc.set(segment.dom, node);
  }

  if (parts.length === 1) {
    return parts[0]!;
  }

  // Several runs inside one text node need a holder the caller can append.
  const holder = context.document.createElement('span');

  holder.append(...parts);

  return holder;
}

/**
 * Wraps a text node in the elements of its marks.
 *
 * Decoration attributes go onto the innermost mark element, or a `span` of their own when the run
 * carries no mark.
 */
function wrapMarks(
  text: DOMNode,
  node: TextNode,
  context: RenderContext,
  decorationAttrs: readonly Record<string, unknown>[],
): DOMNode {
  const extra = decorationAttrs.reduce<Record<string, unknown>>(
    (all, attrs) => ({ ...all, ...attrs }),
    {},
  );
  const marks = [...node.markSet].sort((a, b) => a.type.name.localeCompare(b.type.name));
  let current = text;

  for (const mark of marks) {
    const rule = context.rules.marks[mark.type.name];

    if (!rule) {
      continue;
    }

    const element = context.document.createElement(ruleTag(rule.tag, mark));

    applyAttrs(element, rule.attrs?.(mark) ?? {});
    element.append(current);
    current = element;
  }

  if (Object.keys(extra).length === 0) {
    return current;
  }

  const holder = context.document.createElement('span');

  applyAttrs(holder, extra);
  holder.append(current);

  return holder;
}
