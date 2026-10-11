import type { Node as DocNode } from '../model/node.ts';
import type { Selection } from '../selection/selection.ts';
import type { DOMElement, DOMNode, DOMText, ViewMaps } from './dom-renderer.ts';

import { AllSelection } from '../selection/all-selection.ts';
import { NodeSelection } from '../selection/node-selection.ts';
import { TextSelection } from '../selection/text-selection.ts';

/** A DOM position: a node and an offset inside it. */
export interface DOMPosition {
  /** The DOM node the offset points into. */
  node: DOMNode;
  /** Offset, counting characters inside a text node or children of an element. */
  offset: number;
}

/**
 * DOM position of a document position.
 *
 * The resolved position already knows the path it took through the document, so the walk follows it
 * through the renderer's identity maps. A block spends one position on each side of its content, so
 * a position at a block's start addresses the element's first child while one at its end addresses
 * the position *inside* it — two different DOM offsets, and treating them as one puts the caret in
 * front of the wrong thing at the end of every line.
 *
 * The answer always has to survive {@link posAtDom}: whether a boundary in front of a child belongs
 * to its left character or to the node on its right is decided by which can address it, and text
 * can address the boundary behind its last character while a block cannot address the boundary
 * behind its opening token.
 */
export function domAtPos(maps: ViewMaps, doc: DocNode, pos: number): DOMPosition | null {
  const $pos = doc.resolve(pos);
  const root: DOMElement | undefined = maps.contentDOM.get($pos.node(0));

  if (!root) {
    return null;
  }

  let container: DOMElement = root;

  // A position that stopped at the document sits between two top level blocks.
  if ($pos.depth === 0) {
    return { node: container, offset: Math.min($pos.index(0), container.childNodes.length) };
  }

  for (let depth = 1; depth <= $pos.depth; depth++) {
    const entry = $pos.path[depth]!;
    const node = entry.node;

    // An `inner` entry is a text node, which spends its token on its own characters: `entry.start`
    // *is* its first character, while the content of every other node begins one position later.
    if (entry.inner === true) {
      return textPositionAt(maps, node, pos - entry.start) ?? { node: container, offset: 0 };
    }

    const holding: DOMElement = maps.contentDOM.get(node) ?? container;
    const element = maps.docToDom.get(node);
    const child = node.maybeChild(entry.index);
    const text = textAt(node, entry.index);
    // ResolvedPathEntry.start is already the first content position of this node.
    const contentStart = entry.start;

    // Text spends its token on its characters rather than on an opening boundary, so the boundary
    // in front of a block's first character *is* that block's first position — `(text, 0)` and `(p,
    // 0)` are one gap, and the text node is what addresses it, as it does a caret behind its last
    // character.
    if (text) {
      const offset = pos - contentStart - documentOffsetOfChild(node, text.index);

      if (offset >= 0 && offset <= text.node.nodeSize) {
        const at = textPositionAt(maps, text.node, offset) ?? textPositionAt(maps, text.node, 0);

        if (at) {
          return at;
        }
      }
    }

    // A block as the first child is the case that needs the descent: the two boundaries are one
    // gap, a browser puts a caret placed there inside the child, and {@link posAtDom} answers that
    // gap with the child's own position. Naming it from this level would make the caret at the
    // start of a list's first item read back as the caret on the list.
    if (pos === contentStart) {
      const start = child ? maps.docToDom.get(child) : undefined;

      if (start && !child?.isLeaf && isElement(start) && start.parentNode === holding) {
        return { node: start, offset: 0 };
      }

      return { node: holding, offset: inFrontOfChild(maps, holding, node, entry.index) ?? 0 };
    }

    // A leaf spends one position on the atom itself: its first position is the boundary in front of
    // it.
    if (
      child?.isLeaf &&
      !child.isText &&
      pos <= contentStart + documentOffsetOfChild(node, entry.index)
    ) {
      return { node: holding, offset: inFrontOfChild(maps, holding, node, entry.index) ?? 0 };
    }

    // Past the last child: the position is the end of this node's content, behind whatever the last
    // child renders.
    const last = node.childCount - 1;
    const boundary =
      inFrontOfChild(maps, holding, node, Math.min(entry.index, last)) ??
      inFrontOfChild(maps, holding, node, last);

    if (!child) {
      const filler = holding.lastChild;
      // View-only trailing breaks provide a line box, but the caret belongs before them.
      const hasFiller = filler && isElement(filler) && filler.hasAttribute('data-rt-filler');
      return { node: holding, offset: holding.childNodes.length - (hasFiller ? 1 : 0) };
    }

    // A child that renders as an element owns the positions inside it, so the walk descends there.
    if (!child.isText && !child.isLeaf && element && isElement(element)) {
      container = holding;
      continue;
    }

    return { node: holding, offset: boundary ?? holding.childNodes.length };
  }

  return { node: container, offset: container.childNodes.length };
}

/**
 * Characters a DOM node contributes to its block's content.
 *
 * Text counts as its characters — a decoration may have split one document text node into several
 * DOM text nodes, so only the segment's own length counts — an atom as its token, and a block as
 * what its children contribute.
 */
export function domTextLength(maps: ViewMaps, dom: DOMNode): number {
  if (isText(dom)) {
    // Counting the whole document node instead would make every offset after this piece drift.
    return dom.data.length;
  }

  const node = maps.domToDoc.get(dom);

  if (node && !node.isText && node.isLeaf) {
    return 1;
  }

  let total = 0;

  for (const child of Array.from(dom.childNodes)) {
    total += domTextLength(maps, child);
  }

  return total;
}

/** Whether a DOM node is a text node. */
export function isText(dom: DOMNode): dom is DOMText {
  return dom.nodeType === 3;
}

/**
 * Document position of a DOM position inside a rendered view.
 *
 * The walk descends the DOM's ancestor chain from the view root and translates each step into
 * document offsets: one DOM child of a content element is one document child. Mark elements and
 * anything else the renderer did not create are looked through, which is what lets the view read
 * back changes the browser made on its own.
 *
 * This is the inverse of {@link domAtPos}, for every gap a browser can put a caret in: a DOM offset
 * naming a child means that child's first document position, never the boundary in front of it,
 * because the two are one gap and the earlier answer moves the caret off the node the user is
 * looking at.
 */
export function posAtDom(
  maps: ViewMaps,
  root: DOMElement,
  dom: DOMNode,
  offset: number,
): null | number {
  const start = maps.domToDoc.get(root);

  if (!start) {
    return null;
  }

  // The root is the document's own content element, so its offsets are document offsets.
  if (dom === root) {
    return documentOffsetOfChild(start, offset);
  }

  const chain = chainFrom(root, dom);

  if (!chain) {
    return null;
  }

  let node = start;
  let contentStart = 0;

  for (let level = 1; level < chain.length; level++) {
    const child = chain[level]!;
    const parent = chain[level - 1]!;
    const isLast = level === chain.length - 1;
    const docChild = docNodeOf(maps, child);

    if (!docChild) {
      // Nothing inside this element belongs to the document, so it contributes no positions: the
      // position plus the characters before it.
      if (isLast) {
        return contentStart + offsetWithin(maps, parent, child, offset);
      }

      continue;
    }

    const index = indexOfChild(node, docChild);

    if (index < 0) {
      continue;
    }

    const before = contentStart + documentOffsetOfChild(node, index);

    if (isLast) {
      if (isText(child)) {
        const segment = segmentOf(maps, docChild, child);

        // Text spends its positions on characters, without an opening token. `before` already
        // includes the parent block's opening token, so adding one here skips the first character
        // when a native DOM selection is read back into the document.
        return (
          before + (segment ? segment.start + offset : offsetWithin(maps, parent, child, offset))
        );
      }

      if (!docChild.isLeaf) {
        // An element child spends one position on each side of its content, so offset `n` sits in
        // front of child `n` and an offset at or past the end addresses the end of the content: the
        // closing token has no DOM gap to name it.
        return before + 1 + documentOffsetOfChild(docChild, Math.min(offset, docChild.childCount));
      }

      // A leaf is its own single position.
      return before;
    }

    if (docChild.isText || docChild.isLeaf) {
      // A leaf or a text node has no content to descend into.
      continue;
    }

    node = docChild;
    contentStart = before + 1;
  }

  return contentStart;
}

/** The browser's selection read as a document selection, or `null`. */
export function readSelection(
  maps: ViewMaps,
  root: DOMElement,
  doc: DocNode,
  domSelection: globalThis.Selection | null,
): null | Selection {
  if (!domSelection || domSelection.rangeCount === 0) {
    return null;
  }

  const anchorNode = domSelection.anchorNode;
  const headNode = domSelection.focusNode;
  const anchor = anchorNode ? posAtDom(maps, root, anchorNode, domSelection.anchorOffset) : null;
  const head = headNode ? posAtDom(maps, root, headNode, domSelection.focusOffset) : null;

  if (anchor === null || head === null) {
    return null;
  }

  if (anchor === head) {
    const $pos = doc.resolve(anchor);
    // Native Control+End can put the caret *after* a table rather than inside its last cell.
    // Text cannot be inserted between ordinary blocks. Keep atom edges for Enter's paragraph
    // fallback, but normalize other document boundaries to an editable text position.
    if ($pos.depth === 0 && !$pos.nodeBefore()?.isLeaf && !$pos.nodeAfter()?.isLeaf) {
      return TextSelection.near(doc, anchor, anchor === doc.content.size ? -1 : 1);
    }
  }

  return TextSelection.create(doc, anchor, head);
}

/** Writes a document selection into the browser's selection. */
export function writeSelection(
  maps: ViewMaps,
  doc: DocNode,
  selection: Selection,
  domSelection: globalThis.Selection | null,
  domDocument: Document,
): boolean {
  if (!domSelection) {
    return false;
  }

  if (selection instanceof NodeSelection) {
    const dom = maps.docToDom.get(selection.node);

    if (!dom || !isElement(dom)) {
      return false;
    }

    const range = domDocument.createRange();

    range.selectNode(dom);
    // A node view with its own selection controls can represent the model selection without
    // painting a native range over its content. The controller still records this caret write.
    if (dom.getAttribute('data-node-selection') === 'controls') {
      range.collapse(true);
    }
    domSelection.removeAllRanges();
    domSelection.addRange(range);

    return true;
  }

  // Selecting everything is a range over the whole editable element, which is how a browser
  // expresses `Mod-a` inside one.
  if (selection instanceof AllSelection) {
    const range = domDocument.createRange();

    range.selectNodeContents(maps.contentDOM.get(selection.$anchor.node(0)) ?? domDocument.body);
    domSelection.removeAllRanges();
    domSelection.addRange(range);

    return true;
  }

  const anchor = domAtPos(maps, doc, selection.anchor);
  const head = selection.empty ? anchor : domAtPos(maps, doc, selection.head);

  if (!anchor || !head) {
    return false;
  }

  // A Selection has an anchor and a focus, unlike a Range, whose start must come before its end.
  // setBaseAndExtent preserves a backward selection and lets Shift+Arrow continue in that
  // direction. A range built from anchor as start would collapse when anchor is after head.
  // Invalid DOM offsets leave the browser's current selection untouched.
  try {
    domSelection.setBaseAndExtent(anchor.node, anchor.offset, head.node, head.offset);
  } catch {
    return false;
  }

  return true;
}

/** DOM nodes from `root` down to `dom`, or `null` when `dom` is not below `root`. */
function chainFrom(root: DOMNode, dom: DOMNode): DOMNode[] | null {
  const chain: DOMNode[] = [];
  let current: DOMNode | null = dom;

  while (current) {
    chain.unshift(current);

    if (current === root) {
      return chain;
    }

    current = current.parentNode;
  }

  return null;
}

/** The document node a DOM node renders, looking through wrappers it did not make. */
function docNodeOf(maps: ViewMaps, dom: DOMNode): DocNode | undefined {
  const direct = maps.domToDoc.get(dom);

  if (direct) {
    return direct;
  }

  for (const child of Array.from(dom.childNodes)) {
    const inner = docNodeOf(maps, child);

    if (inner) {
      return inner;
    }
  }

  return undefined;
}

/** Content offset of child `index` of a document node. */
function documentOffsetOfChild(node: DocNode, index: number): number {
  let offset = 0;

  for (let i = 0; i < index && i < node.childCount; i++) {
    offset += node.child(i).nodeSize;
  }

  return offset;
}

/** Index of `child` among the children of `node`, by identity. */
function indexOfChild(node: DocNode, child: DocNode): number {
  for (let index = 0; index < node.childCount; index++) {
    if (node.child(index) === child) {
      return index;
    }
  }

  return -1;
}

/**
 * DOM offset in front of a rendered child inside its container.
 *
 * Element offsets count DOM children, including text nodes, rather than their character lengths.
 * Walking rendered children keeps the answer right when marks or decorations wrap text.
 */
function inFrontOf(container: DOMElement, child: DOMNode): null | number {
  const index = Array.from(container.childNodes).findIndex((rendered) => rendered === child);
  return index < 0 ? null : index;
}

/** DOM offset in front of child `index` of `node`, or `null` when it shows nothing. */
function inFrontOfChild(
  maps: ViewMaps,
  container: DOMElement,
  node: DocNode,
  index: number,
): null | number {
  if (index < 0 || index >= node.childCount) {
    return null;
  }

  const target = maps.docToDom.get(node.child(index));

  if (!target || target.parentNode !== container) {
    return null;
  }

  return inFrontOf(container, target);
}

/** Whether a DOM node is an element. */
function isElement(dom: DOMNode): dom is HTMLElement {
  return dom.nodeType === 1;
}

/** Characters before a DOM position inside one element. */
function offsetWithin(maps: ViewMaps, parent: DOMNode, dom: DOMNode, offset: number): number {
  let total = 0;

  for (const child of Array.from(parent.childNodes)) {
    if (child === dom) {
      return total + (isText(dom) ? offset : 0);
    }

    total += domTextLength(maps, child);
  }

  return total;
}

/** The rendered piece of a document text node holding a DOM text node, if any. */
function segmentOf(maps: ViewMaps, docText: DocNode, dom: DOMNode): { start: number } | undefined {
  return (maps.textSegments.get(docText) ?? []).find((segment) => segment.dom === dom);
}

/** The text node child `index` of `node` holds, and the index it sits at. */
function textAt(node: DocNode, index: number): { index: number; node: DocNode } | null {
  const child = node.maybeChild(index);

  if (child?.isText) {
    return { index, node: child };
  }

  // At an atom's leading boundary, prefer the end of the preceding text run. A caret on the
  // parent element can be normalized by the browser to the other side of contenteditable=false.
  if (child?.isLeaf && index > 0) {
    const previous = node.maybeChild(index - 1);
    if (previous?.isText) {
      return { index: index - 1, node: previous };
    }
  }

  // An index past the last child is the end of this node's content, whose last position belongs to
  // the text run that ends there; `posAtDom` reads it back as the last character plus one, so both
  // directions must agree.
  if (child === undefined && node.childCount > 0) {
    const last = node.childCount - 1;
    const candidate = node.maybeChild(last);

    if (candidate?.isText) {
      return { index: last, node: candidate };
    }
  }

  return null;
}

/**
 * DOM position of an offset inside a text node.
 *
 * A decoration may have split one document text node into several DOM text nodes, so the offset is
 * looked up among the pieces rather than written into the first one.
 */
function textPositionAt(maps: ViewMaps, node: DocNode, offset: number): DOMPosition | null {
  const segments = maps.textSegments.get(node);

  if (segments) {
    const ordered = [...segments].sort((a, b) => a.start - b.start);

    for (const segment of ordered) {
      if (offset >= segment.start && offset <= segment.start + segment.dom.data.length) {
        return { node: segment.dom, offset: offset - segment.start };
      }
    }

    if (ordered[0]) {
      return { node: ordered[0].dom, offset: 0 };
    }
  }

  const element = maps.docToDom.get(node);

  return element ? { node: element, offset: 0 } : null;
}
