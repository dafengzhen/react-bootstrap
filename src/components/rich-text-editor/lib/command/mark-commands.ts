import type { MarkType } from '../model/mark-type.ts';
import type { Mark } from '../model/mark.ts';
import type { Node } from '../model/node.ts';
import type { ResolvedPos } from '../position/resolved-pos.ts';
import type { LinkAttrs } from '../serialization/link.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { Attrs } from '../util/object.ts';
import type { Command } from './command.ts';

import { TextSelection } from '../selection/text-selection.ts';
import { linkAttrsFrom } from '../serialization/html-parser.ts';

/**
 * Removes every inline mark from the selection.
 *
 * Block structure is left alone on purpose, so clearing formatting inside a
 * heading keeps the heading.
 */
export function clearInlineFormatting(): Command {
  return (state, dispatch) => {
    const { from, to } = state.selection;

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;

    for (const type of Object.values(state.schema.marks)) {
      for (const mark of marksInSelection(state, type)) {
        tr.removeMark(from, to, mark);
      }
    }

    if (!tr.docChanged) {
      return false;
    }

    tr.setMeta('historyGroup', 'mark');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/**
 * Calls `f` for every text node that overlaps the absolute range `[from, to)`.
 *
 * Selections are expressed in document positions, so the walk tracks the absolute
 * position of each content and descends only into the branches the range touches.
 */
export function forEachTextNode(
  doc: Node,
  from: number,
  to: number,
  f: (node: Node, start: number) => void,
): void {
  walkText(doc, 0, from, to, f);
}

/**
 * Puts a link over the selection.
 *
 * With a range selected the whole range becomes the link; with a bare cursor the URL itself is
 * inserted as the link text. An explicit `text` replaces the selected text when it differs,
 * preserving the inline marks at the start of the range. The URL is
 * sanitized first, so a `javascript:` value can never reach the document (design §42).
 *
 * ```ts
 * insertLink({ href: 'https://example.com' });
 * ```
 */
export function insertLink(attrs: LinkAttrs): Command {
  return (state, dispatch) => {
    const type = state.schema.marks.link;

    if (!type) {
      return false;
    }

    const linkAttrs = linkAttrsFrom(attrs);

    if (!linkAttrs.href) {
      return false;
    }

    const mark = type.create(linkAttrs);
    const { empty, from, to } = state.selection;
    const text = attrs.text ?? String(linkAttrs.href);

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;

    if (!empty && attrs.text !== undefined && text !== state.selection.textBetween) {
      let inherited: readonly Mark[] = [];
      let found = false;
      forEachTextNode(state.doc, from, to, (node) => {
        if (!found) {
          inherited = node.markSet.filter((existing) => existing.type !== type);
          found = true;
        }
      });
      tr.replaceSelectionWith(text ? state.schema.text(text, inherited) : text);
      if (!tr.docChanged) {
        return false;
      }
      for (const existing of marksInSelection(state, type)) {
        tr.removeMark(from, from + text.length, existing);
      }
      tr.addMark(from, from + text.length, mark);
      tr.setSelection(TextSelection.create(tr.doc, from, from + text.length));
    } else if (empty) {
      tr.insert(from, text);
      tr.addMark(from, from + text.length, mark);
      tr.setSelection(TextSelection.create(tr.doc, from + text.length));
    } else {
      // Any older link in the range goes first, so re-linking replaces it.
      for (const existing of marksInSelection(state, type)) {
        tr.removeMark(from, to, existing);
      }

      tr.addMark(from, to, mark);
      tr.setSelection(TextSelection.create(tr.doc, from, to));
    }

    if (!tr.docChanged) {
      return false;
    }

    tr.setMeta('historyGroup', 'mark');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** Whether the selection is a cursor inside a textblock. */
export function inTextblock(state: EditorState): boolean {
  return state.selection.$from.parent.isText || state.selection.$from.parent.isBlock;
}

/**
 * Whether `mark` is active in a range.
 *
 * Empty selection: the mark the editor holds for the next typed character first, then the one on
 * the character before the cursor, so a toolbar button lights up both right after it was pressed
 * and while typing inside bold text. A range is active as soon as any of its characters carries
 * `mark`.
 *
 * The character *before* the caret decides, matching {@link Transaction}: a caret after a link is
 * outside the link, and the two answers have to agree or a toolbar would show a link that typing
 * would not continue.
 */
export function markActive(state: EditorState, type: MarkType, attrs?: Attrs): boolean {
  const { empty, from, to } = state.selection;

  if (empty) {
    if (state.storedMark?.type === type && state.storedMark.matchesAttrs(attrs)) {
      return true;
    }

    const $from = state.doc.resolve(from);
    const marks = $from.nodeBefore()?.markSet ?? [];

    return marks.some((mark) => mark.type === type && mark.matchesAttrs(attrs));
  }

  let active = false;

  forEachTextNode(state.doc, from, to, (node) => {
    if (!active && node.markSet.some((mark) => mark.type === type && mark.matchesAttrs(attrs))) {
      active = true;
    }
  });

  return active;
}

/**
 * Whether every character of the selection carries `mark`.
 *
 * Toggling uses this rather than {@link markActive}: a selection that only partly carries the
 * mark is completed instead of stripped.
 */
export function markCoversSelection(state: EditorState, type: MarkType, attrs?: Attrs): boolean {
  const { empty, from, to } = state.selection;

  if (empty) {
    return markActive(state, type, attrs);
  }

  let covered = true;

  forEachTextNode(state.doc, from, to, (node) => {
    if (!node.markSet.some((mark) => mark.type === type && mark.matchesAttrs(attrs))) {
      covered = false;
    }
  });

  return covered;
}

/** Every mark of `type` in the selection, or the marks at an empty cursor. */
export function marksInSelection(state: EditorState, type: MarkType): Mark[] {
  const { empty, from, to } = state.selection;
  const found = new Map<string, Mark>();

  if (empty) {
    const marks = state.doc.resolve(from).nodeBefore()?.markSet ?? [];

    for (const mark of marks) {
      if (mark.type === type) {
        found.set(JSON.stringify(mark.attrs), mark);
      }
    }

    return [...found.values()];
  }

  forEachTextNode(state.doc, from, to, (node) => {
    for (const mark of node.markSet) {
      if (mark.type === type) {
        found.set(JSON.stringify(mark.attrs), mark);
      }
    }
  });

  return [...found.values()];
}

/** Sets `mark` over the selection, removing every other mark of the same type. */
export function setMark(type: MarkType, attrs: Attrs = {}): Command {
  return (state, dispatch) => {
    const { from, to } = state.selection;
    const mark = type.create(attrs);

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;

    for (const existing of marksInSelection(state, type)) {
      tr.removeMark(from, to, existing);
    }

    tr.addMark(from, to, mark);

    if (!tr.docChanged) {
      return false;
    }

    tr.setMeta('historyGroup', 'mark');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** The mark the editor would apply to the next typed character. */
export function storedMark(state: EditorState): Mark | null {
  return state.storedMark;
}

/**
 * Toggles `mark` over the selection.
 *
 * When every marked character already carries the mark it is removed, otherwise it is added —
 * the behaviour every toolbar button expects.
 */
export function toggleMark(type: MarkType, attrs: Attrs = {}): Command {
  return (state, dispatch) => {
    const { empty, from, to } = state.selection;
    const mark = type.create(attrs);

    if (empty) {
      if (!dispatch) {
        return true;
      }

      // A collapsed cursor cannot carry marks, so the editor remembers the mark
      // for the next typed character instead.
      const stored = storedMark(state);
      const next = stored && stored.eq(mark) ? null : mark;
      const tr = state.tr.setStoredMark(next);

      tr.setMeta('historyGroup', 'mark');
      dispatch(tr);

      return true;
    }

    const active = markCoversSelection(state, type, attrs);

    if (!dispatch) {
      return true;
    }

    const tr = active ? state.tr.removeMark(from, to, mark) : state.tr.addMark(from, to, mark);

    if (!tr.docChanged) {
      return false;
    }

    tr.setMeta('historyGroup', 'mark');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** Convenience wrapper: `toggleBold()`. */
export function toggleMarkOf(typeName: string, attrs: Attrs = {}): Command {
  return (state, dispatch) => {
    const type = state.schema.marks[typeName];

    if (!type) {
      return false;
    }

    return toggleMark(type, attrs)(state, dispatch);
  };
}

/** Removes every link from the selection. */
export function unsetLink(): Command {
  return (state, dispatch) => {
    const type = state.schema.marks.link;

    if (!type) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;
    const { from, to } = state.selection;

    for (const mark of marksInSelection(state, type)) {
      tr.removeMark(from, to, mark);
    }

    if (!tr.docChanged) {
      return false;
    }

    tr.setMeta('historyGroup', 'mark');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/** Removes every mark of `type` from the selection. */
export function unsetMark(type: MarkType): Command {
  return (state, dispatch) => {
    const { from, to } = state.selection;

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;

    for (const existing of marksInSelection(state, type)) {
      tr.removeMark(from, to, existing);
    }

    if (!tr.docChanged) {
      return false;
    }

    tr.setMeta('historyGroup', 'mark');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/**
 * Recursive half of {@link forEachTextNode}.
 *
 * @internal
 */
function walkText(
  node: Node,
  contentStart: number,
  from: number,
  to: number,
  f: (node: Node, start: number) => void,
): void {
  for (let index = 0; index < node.childCount; index++) {
    const child = node.child(index);
    const childStart = contentStart + node.contentOffsetOf(index);
    const childEnd = childStart + child.nodeSize;

    if (childEnd <= from || childStart >= to) {
      continue;
    }

    if (child.isText) {
      f(child, childStart);
    } else if (!child.isLeaf) {
      // A container spends its first token on its own opening boundary.
      walkText(child, childStart + 1, from, to, f);
    }
  }
}

/** Re-exported for command modules that need the resolved position type. */
export type { ResolvedPos, TextSelection };
