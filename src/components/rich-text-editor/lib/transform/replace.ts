import type { Fragment } from '../model/fragment.ts';
import type { Node } from '../model/node.ts';
import type { Slice } from '../model/slice.ts';
import type { ResolvedPos } from '../position/resolved-pos.ts';

import { Fragment as FragmentClass } from '../model/fragment.ts';
import { Slice as SliceClass } from '../model/slice.ts';

/** Content a replace operation can insert. */
export type ReplaceContent = Fragment | Node | readonly Node[] | Slice | string;

/** The replacement steps an edit needs, plus where the cursor goes afterwards. */
export interface ReplacePlan {
  /** Position in the final document just after the inserted content. */
  cursor: number;
  /** The ranges to replace, in order. */
  ranges: readonly ReplaceRange[];
}

/** One replacement to apply, in plan order. */
export interface ReplaceRange {
  /** Absolute position the range starts at. */
  from: number;
  /** Content to put in its place. */
  slice: Slice;
  /** Absolute position the range ends at. */
  to: number;
}

/** Result of a successful replace. */
export interface ReplaceResult {
  /** Position in the new document after the inserted content. */
  cursor: number;
  /** The document produced by the replacement. */
  doc: Node;
}

/** The block an edit happens in, with the path from the document to it. */
interface BlockTarget {
  /** Absolute position of the block's own opening token. */
  base: number;
  /** Depth of the block inside the document. */
  depth: number;
  /** The block itself. */
  node: Node;
  /** Ancestors from the document down to the block's parent. */
  parents: readonly Node[];
  /** Child indices from the document down to the block. */
  path: readonly number[];
}

/**
 * Turns loose content into a closed slice: the open depth stays a property of the position, not of
 * the caller, so a plain string, a node list and a fragment all behave the same.
 */
export function contentAsSlice($from: ResolvedPos, content: ReplaceContent): Slice {
  if (content instanceof SliceClass) {
    return content;
  }

  if (content instanceof FragmentClass) {
    return content.size === 0 ? SliceClass.empty : new SliceClass(content, 0, 0);
  }

  if (typeof content === 'string') {
    const textType = $from.doc.type.schema?.nodes.text;

    if (!textType || content.length === 0) {
      return SliceClass.empty;
    }

    return new SliceClass(FragmentClass.from([textType.create(undefined, content)]), 0, 0);
  }

  const nodes = Array.isArray(content) ? content : [content as Node];

  return nodes.length === 0 ? SliceClass.empty : new SliceClass(FragmentClass.from(nodes), 0, 0);
}

/**
 * Content of a slice with the open levels unwrapped: a slice cut from the middle of a paragraph
 * inserts its text, not a nested paragraph.
 */
export function fittedContent(slice: Slice): Fragment {
  let content: Fragment = slice.content;

  for (let level = 0; level < slice.openStart; level++) {
    const first = content.maybeChild(0);

    if (!first || first.isLeaf) {
      break;
    }

    content = first.content.append(content.cut(first.nodeSize));
  }

  for (let level = 0; level < slice.openEnd; level++) {
    const last = content.maybeChild(content.childCount - 1);

    if (!last || last.isLeaf) {
      break;
    }

    content = content.cut(0, content.size - last.nodeSize).append(last.content);
  }

  return content;
}

/**
 * Works out how to apply a replacement, in one step when the schema allows it and in two when it
 * does not: inline content cannot be spliced across a block boundary, so typing over a selection
 * spanning two paragraphs deletes the range first and inserts into the block left behind.
 */
export function planReplace(doc: Node, from: number, to: number, slice: Slice): null | ReplacePlan {
  const single = replaceStep(doc, from, to, slice);

  if (single) {
    return { cursor: single.cursor, ranges: [{ from, slice, to }] };
  }

  if (slice.size === 0) {
    return null;
  }

  const deleted = replaceStep(doc, from, to, SliceClass.empty);
  const inserted = deleted ? replaceStep(deleted.doc, from, from, slice) : null;

  if (!deleted || !inserted) {
    return null;
  }

  return {
    cursor: inserted.cursor,
    ranges: [
      { from, slice: SliceClass.empty, to },
      { from, slice, to: from },
    ],
  };
}

/**
 * Replaces `[from, to)` in `doc` with `slice`; every edit — typing, deleting, pasting, splitting,
 * joining — funnels through here. Returns `null` when the schema does not allow the result, so an
 * illegal edit is rejected instead of corrupting the document.
 *
 * ```ts
 * const result = replaceStep(doc, 7, 7, new Slice(Fragment.from([schema.text('!')])));
 * result?.cursor; // where the cursor belongs afterwards
 * ```
 */
export function replaceStep(
  doc: Node,
  from: number,
  to: number,
  slice: Slice,
): null | ReplaceResult {
  if (from > to || from < 0 || to > doc.content.size) {
    return null;
  }

  if (from === to && slice.size === 0) {
    return { cursor: from, doc };
  }

  // Closed block content at document boundaries belongs to the document, not to the next
  // paragraph or atom. Descending into that sibling rejects insertion between existing blocks.
  if (
    slice.openStart === 0 &&
    slice.openEnd === 0 &&
    slice.content.children.every((child) => child.isBlock) &&
    doc.resolve(from).depth === 0 &&
    doc.resolve(to).depth === 0
  ) {
    const content = doc.content.cut(0, from).append(slice.content).append(doc.content.cut(to));
    return doc.contentMatch.canReplace(0, 0, FragmentClass.empty, content)
      ? { cursor: from + slice.content.size, doc: doc.copy(content) }
      : null;
  }

  const target = blockAt(doc, from);

  if (!target) {
    return null;
  }

  // `base` is the block's opening token, so a content offset is `pos - base - 1`; a range outside
  // `[0, content.size]` belongs to an ancestor, handled by `replaceAcrossBlocks`.
  const start = from - target.base - 1;
  const end = to - target.base - 1;

  if (start < 0 || end > target.node.content.size) {
    return replaceAcrossBlocks(doc, doc.resolve(from), target, slice, to);
  }

  const replaced = replaceIn(target.node, start, end, slice);

  if (!replaced) {
    return null;
  }

  const patched = target.depth === 0 ? replaced.node : rebuild(doc, target, replaced.node);

  return patched ? { cursor: target.base + 1 + replaced.cursor, doc: patched } : null;
}

/** Ancestors of the node at `depth`, from the document down to its parent. */
function ancestorsOf($pos: ResolvedPos, depth: number): Node[] {
  const ancestors: Node[] = [];

  for (let level = 0; level < depth; level++) {
    ancestors.push($pos.node(level));
  }

  return ancestors;
}

/**
 * The block an edit at `pos` belongs to: the walk descends into the child whose span covers `pos`,
 * stopping at inline content, which belongs to the block around it, and at an atom block, which is
 * addressed as a unit. A position no child covers belongs to the node it sits in.
 */
function blockAt(doc: Node, pos: number): BlockTarget | null {
  let node: Node = doc;
  let contentStart = 0;
  const parents: Node[] = [];
  const path: number[] = [];

  for (;;) {
    const index = coveringChild(node, contentStart, pos);

    if (index < 0) {
      // Inside the node's own content: the document's content offsets equal absolute positions,
      // so `base = -1` expresses it.
      return node === doc
        ? { base: -1, depth: 0, node: doc, parents: [], path: [] }
        : {
            base: contentStart - 1,
            depth: parents.length,
            node,
            parents: [...parents],
            path: [...path],
          };
    }

    const child = node.child(index);
    const childStart = contentStart + node.contentOffsetOf(index);

    if (child.isText || child.isInline) {
      // Inline content is edited inside its block.
      return node === doc
        ? null
        : {
            base: contentStart - 1,
            depth: parents.length,
            node,
            parents: [...parents],
            path: [...path],
          };
    }

    if (child.isLeaf) {
      // An atom block has no content, so it is the target itself.
      return {
        base: childStart,
        depth: parents.length + 1,
        node: child,
        parents: [...parents, node],
        path: [...path, index],
      };
    }

    parents.push(node);
    path.push(index);
    node = child;
    contentStart = childStart + 1;
  }
}

/** The characters a node holds: a text node's text, else its content size. */
function contentLength(node: Node): number {
  return node.isText ? node.rawText.length : node.content.size;
}

/**
 * Index of the child whose span covers `pos`, or `-1`: a block spans up to its closing token, a
 * leaf one unit past its size, so a position right after text still belongs to that text.
 */
function coveringChild(node: Node, contentStart: number, pos: number): number {
  let offset = 0;

  for (let index = 0; index < node.childCount; index++) {
    const child = node.child(index);
    const start = contentStart + offset;
    const end = start + child.nodeSize - (child.isLeaf ? 0 : 1);

    if (pos >= start && pos <= end) {
      return index;
    }

    offset += child.nodeSize;
  }

  return -1;
}

/** Content of `content` from child `index` on, dropping `offset` characters of it. */
function cutChildEnd(content: Fragment, index: number, offset: number): Fragment | null {
  if (index >= content.childCount) {
    return FragmentClass.empty;
  }

  const child = content.child(index);
  const dropped = child.isText ? offset : offset - 1;

  if (dropped <= 0) {
    return content.cut(offsetOf(content, index));
  }

  if (dropped >= contentLength(child)) {
    return content.cut(offsetOf(content, index) + child.nodeSize);
  }

  return FragmentClass.from([
    cutPart(child, dropped, contentLength(child)),
    ...content.children.slice(index + 1),
  ]);
}

/**
 * Content of `content` before child `index`, keeping the first `offset` characters of that child:
 * `offset` counts from the child's start, so a container, which owns its opening token, keeps
 * `offset - 1` characters and a text node, which has no tokens of its own, keeps `offset`.
 */
function cutChildStart(content: Fragment, index: number, offset: number): Fragment | null {
  const child = content.maybeChild(index);

  if (!child) {
    return FragmentClass.empty;
  }

  const kept = child.isText ? offset : offset - 1;

  // Nothing of the child is kept, so it disappears rather than shrinking to a node its content
  // model could not hold.
  if (kept <= 0) {
    return content.cut(0, offsetOf(content, index));
  }

  if (kept >= contentLength(child)) {
    return content.cut(0, offsetOf(content, index) + child.nodeSize);
  }

  return FragmentClass.from([...content.children.slice(0, index), cutPart(child, 0, kept)]);
}

/** The part of `node` between two character offsets. */
function cutPart(node: Node, from: number, to: number): Node {
  return node.isText
    ? node.type.create(undefined, node.rawText.slice(from, to))
    : node.cut(from, to);
}

/** Index right after the child that contains content offset `offset`. */
function indexAfter(content: Fragment, offset: number): number {
  let current = 0;

  for (let index = 0; index < content.childCount; index++) {
    current += content.child(index).nodeSize;

    if (current >= offset) {
      return index + 1;
    }
  }

  return content.childCount;
}

/**
 * Index of the child whose span contains content offset `offset`: the first position of a child
 * belongs to the child itself, which is what makes typing at the beginning of a block extend that
 * block.
 */
function indexAt(content: Fragment, offset: number): number {
  let current = 0;

  for (let index = 0; index < content.childCount; index++) {
    const size = Math.max(content.child(index).nodeSize, 1);

    if (current <= offset && offset < current + size) {
      return index;
    }

    current += size;
  }

  return content.childCount;
}

/** Inserts `slice` after the last child of `parent`. */
function insertAtEnd(parent: Node, slice: Slice): { cursor: number; node: Node } | null {
  const content = parent.content;
  const inserted = fittedContent(slice);

  if (!parent.contentMatch.canReplace(content.childCount, content.childCount, content, inserted)) {
    return null;
  }

  return { cursor: content.size + inserted.size, node: parent.copy(content.append(inserted)) };
}

/** Content offset of child `index`; children tile the content. */
function offsetOf(content: Fragment, index: number): number {
  let offset = 0;

  for (let i = 0; i < index && i < content.childCount; i++) {
    offset += content.child(i).nodeSize;
  }

  return offset;
}

/** Child indices from the document down to `depth`. */
function pathTo($pos: ResolvedPos, depth: number): number[] {
  const path: number[] = [];

  for (let level = 1; level <= depth; level++) {
    path.push($pos.index(level - 1));
  }

  return path;
}

/**
 * Rebuilds from the replaced block up to the root, replacing only the child on the path at each
 * level, which is what preserves structural sharing for the untouched parts of the tree.
 */
function rebuild(doc: Node, target: BlockTarget, node: Node): Node | null {
  let current = node;

  for (let level = target.depth; level > 0; level--) {
    const parent = target.parents[level - 1];

    if (!parent) {
      return null;
    }

    current = parent.copy(replaceChildAt(parent.content, target.path[level - 1]!, current));
  }

  void doc;

  return current;
}

/**
 * Handles an edit whose range reaches beyond the block that contains its start: the edit is re-run
 * inside the closest ancestor both ends share, so deleting a selection across paragraphs and
 * pasting blocks over blocks both land here.
 */
function replaceAcrossBlocks(
  doc: Node,
  $from: ResolvedPos,
  boundary: BlockTarget,
  slice: Slice,
  to: number,
): null | ReplaceResult {
  const $to = doc.resolve(to);
  let depth = Math.min(boundary.depth, $from.depth, $to.depth);

  while (depth > 0 && $from.node(depth) !== $to.node(depth)) {
    depth--;
  }

  // Depth 0 is the document itself, a fine place to splice top level children into.
  const target = $from.node(depth);

  if (target.isText || target.isLeaf) {
    return null;
  }

  const contentStart = $from.start(depth);
  const replaced = replaceIn(target, $from.pos - contentStart, to - contentStart, slice);

  if (!replaced) {
    return null;
  }

  const patched =
    depth === 0
      ? replaced.node
      : rebuild(
          doc,
          {
            base: contentStart - 1,
            depth,
            node: target,
            parents: ancestorsOf($from, depth),
            path: pathTo($from, depth),
          },
          replaced.node,
        );

  return patched ? { cursor: contentStart + replaced.cursor, doc: patched } : null;
}

/** Replaces one child, keeping the parent's size bookkeeping correct. */
function replaceChildAt(content: Fragment, index: number, node: Node): Fragment {
  const current = content.maybeChild(index);

  if (current && current.nodeSize === node.nodeSize) {
    return content.replaceChild(index, node);
  }

  return FragmentClass.from([
    ...content.children.slice(0, index),
    node,
    ...content.children.slice(index + 1),
  ]);
}

/**
 * Splices `[start, end)` of `parent`'s content with `slice`, and reports the cursor as a content
 * offset, so the caller only adds the block's own base.
 */
function replaceIn(
  parent: Node,
  start: number,
  end: number,
  slice: Slice,
): { cursor: number; node: Node } | null {
  if (parent.isText) {
    return replaceText(parent, start, end, slice);
  }

  const content = parent.content;
  const startIndex = indexAt(content, start);
  const endIndex = indexAfter(content, end);

  // An insertion at an atom boundary belongs to the parent, never to the atom's empty content.
  // Descending into an image here rejects ordinary typing and leaves the browser to mutate DOM.
  if (startIndex === endIndex && !content.maybeChild(startIndex)?.isAtom) {
    const child = content.maybeChild(startIndex);

    if (!child) {
      return insertAtEnd(parent, slice);
    }

    const childBase = offsetOf(content, startIndex);
    const inner = replaceIn(child, start - childBase, end - childBase, slice);

    if (!inner) {
      return null;
    }

    return {
      cursor: childBase + inner.cursor,
      node: parent.copy(replaceChildAt(content, startIndex, inner.node)),
    };
  }

  const before = cutChildStart(content, startIndex, start - offsetOf(content, startIndex));
  // The tail is cut from the child that *holds* `end`, which is not the exclusive splice index
  // when the range stops in the middle of one.
  const tailIndex = indexAt(content, end);
  const after = cutChildEnd(content, tailIndex, end - offsetOf(content, tailIndex));

  if (!before || !after) {
    return null;
  }

  // `before` and `after` already carry the kept parts of the boundary children, so with the
  // inserted content they are the node's whole new content: the result is copied, not spliced in.
  const inserted = fittedContent(slice);
  const outer = before.append(inserted).append(after);

  if (!parent.contentMatch.canReplace(0, 0, FragmentClass.empty, outer)) {
    return null;
  }

  return { cursor: before.size + inserted.size, node: parent.copy(outer) };
}

/** Replaces a range inside a text node by rebuilding it. */
function replaceText(
  text: Node,
  start: number,
  end: number,
  slice: Slice,
): { cursor: number; node: Node } | null {
  if (slice.openStart > 0 || slice.openEnd > 0) {
    return null;
  }

  if (!slice.content.children.every((child) => child.isText)) {
    return null;
  }

  const raw = text.rawText;
  const inserted = slice.content.textContent;
  const clamped = {
    end: Math.min(Math.max(end, 0), raw.length),
    start: Math.min(Math.max(start, 0), raw.length),
  };
  const replaced = raw.slice(0, clamped.start) + inserted + raw.slice(clamped.end);

  return { cursor: clamped.start + inserted.length, node: text.type.create(undefined, replaced) };
}
