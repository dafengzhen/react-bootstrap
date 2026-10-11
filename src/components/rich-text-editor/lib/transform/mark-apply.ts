import type { Mark } from '../model/mark.ts';
import type { Node } from '../model/node.ts';

import { Fragment } from '../model/fragment.ts';
import { isTextNode } from '../model/text-node.ts';

/**
 * Adds or removes `mark` over the absolute range `[from, to)`.
 *
 * Only text nodes are touched; blocks and atoms are rebuilt along the path so the result keeps
 * structural sharing for everything outside the range. Returns `null` when nothing changed, which
 * lets the caller reject a no-op step.
 */
export function applyMark(
  doc: Node,
  from: number,
  to: number,
  mark: Mark,
  remove: boolean,
): Node | null {
  const content = markWalk(doc.content, 0, from, to, mark, remove);

  return content ? doc.copy(content) : null;
}

/** Whether two mark sets carry the same information. */
export function sameMarks(a: readonly Mark[], b: readonly Mark[]): boolean {
  return a.length === b.length && a.every((mark, index) => mark.eq(b[index]!));
}

/**
 * Mark set with `mark` added.
 *
 * A mark of the same type as the new one is dropped rather than stacked, and marks that the new
 * mark excludes go with it — which is what keeps `bold`, mutually exclusive colours or different
 * font sizes from piling up.
 */
export function withMark(marks: readonly Mark[], mark: Mark): readonly Mark[] {
  const result: Mark[] = [];

  for (const existing of marks) {
    if (existing.eq(mark)) {
      return marks;
    }

    if (existing.type === mark.type) {
      if (!mark.type.allowsAttrsOverlap(existing, mark)) {
        continue;
      }

      continue;
    }

    if (mark.type.excludes.includes(existing.type)) {
      continue;
    }

    result.push(existing);
  }

  return [...result, mark];
}

/** Mark set with `mark` removed. */
export function withoutMark(marks: readonly Mark[], mark: Mark): readonly Mark[] {
  return marks.filter((existing) => !existing.eq(mark));
}

/**
 * Recursive walk that collects the marks to apply over a range.
 *
 * `contentStart` is the absolute position of the first content position of the node owning
 * `fragment`, so a child starts at `contentStart + offset` and a container's own content begins
 * one unit later.
 */
function markWalk(
  fragment: Fragment,
  contentStart: number,
  from: number,
  to: number,
  mark: Mark,
  remove: boolean,
): Fragment | null {
  let changed = false;
  const children: Node[] = [];
  let offset = 0;

  for (const child of fragment.children) {
    const childStart = contentStart + offset;
    const childEnd = childStart + child.nodeSize;

    offset += child.nodeSize;

    if (childEnd <= from || childStart >= to) {
      children.push(child);
      continue;
    }

    if (isTextNode(child)) {
      const start = Math.max(from, childStart) - childStart;
      const end = Math.min(to, childEnd) - childStart;
      const parts = splitText(child, start, end, mark, remove);

      if (parts) {
        changed = true;
        children.push(...parts);
      } else {
        children.push(child);
      }

      continue;
    }

    if (child.isLeaf || child.isInline) {
      children.push(child);
      continue;
    }

    const inner = markWalk(child.content, childStart + 1, from, to, mark, remove);

    if (inner) {
      changed = true;
      children.push(child.copy(inner));
    } else {
      children.push(child);
    }
  }

  return changed ? Fragment.from(children) : null;
}

/**
 * Splits a text node into the parts outside and inside `[from, to)`.
 *
 * Returns `null` when the mark set of the covered part would not change, so the
 * walker can avoid rebuilding nodes for nothing.
 */
function splitText(
  text: Node,
  from: number,
  to: number,
  mark: Mark,
  remove: boolean,
): null | readonly Node[] {
  const raw = text.rawText;
  const before = raw.slice(0, from);
  const inside = raw.slice(from, to);
  const after = raw.slice(to);
  const marks = text.markSet;
  const next = remove ? withoutMark(marks, mark) : withMark(marks, mark);

  if (sameMarks(marks, next)) {
    return null;
  }

  const parts: Node[] = [];

  if (before.length > 0) {
    parts.push(text.type.create(undefined, before, marks));
  }

  if (inside.length > 0) {
    parts.push(text.type.create(undefined, inside, next));
  }

  if (after.length > 0) {
    parts.push(text.type.create(undefined, after, marks));
  }

  return parts;
}
