import type { DocNode, EditorState, ResolvedPos, TableTarget } from './rich-text-editor-lib.ts';

/**
 * Where the selection sits inside a table.
 *
 * The engine's table commands address a cell by *table position, row and cell index* rather than by
 * "the cell the caret is in", because a command receives a state and nothing else — it cannot know
 * which of the two answers the caller wanted for a selection that spans several cells. This module
 * is the missing half: it reads the caret, and a selection that covers a whole table, into the
 * target those commands expect.
 */

/** The table the selection is in, and the cell within it. */
export interface TableLocation {
  /** Index of the cell inside its row, which is what the commands address. */
  cell: number;
  /** The table node itself. */
  node: DocNode;
  /** Index of the row, `0` for the first one. */
  row: number;
  /** Position of the table's opening token. */
  tablePos: number;
}

/** Whether the table the selection is in can still take a row, a column or a merge. */
export function canEditTable(state: EditorState): boolean {
  const location = tableAtSelection(state);

  if (!location) {
    return false;
  }

  // The engine refuses structural edits on a table with a vertical span or a ragged row, because
  // rebuilding it would corrupt the spans. The control has to know that before it is pressed.
  let width = -1;

  for (let index = 0; index < location.node.childCount; index++) {
    const row = location.node.child(index);
    let rowWidth = 0;

    for (let cell = 0; cell < row.childCount; cell++) {
      const current = row.child(cell);

      if (Number(current.attr('rowspan') ?? 1) !== 1) {
        return false;
      }

      rowWidth += Number(current.attr('colspan') ?? 1);
    }

    if (width === -1) {
      width = rowWidth;
    } else if (width !== rowWidth) {
      return false;
    }
  }

  return true;
}

/** The table the selection is in, or `null` when it is not in one. */
export function tableAtSelection(state: EditorState): null | TableLocation {
  const selected = selectedTable(state);

  if (selected) {
    return { cell: 0, node: selected.node, row: 0, tablePos: selected.pos };
  }

  const $from = state.doc.resolve(state.selection.from);

  for (let depth = $from.depth; depth > 0; depth--) {
    if ($from.node(depth).name !== 'table') {
      continue;
    }

    // The path below the table is table → row → cell, so the two indices are the ancestors of the
    // position, and a position that resolves deeper than that is inside a cell's own paragraph.
    return {
      cell: cellIndex($from, depth),
      node: $from.node(depth),
      row: rowIndex($from, depth),
      tablePos: $from.before(depth),
    };
  }

  return null;
}

/** How many cells the row the selection is in has, or `0`. */
export function tableColumnCount(state: EditorState): number {
  const location = tableAtSelection(state);
  const row = location?.node.child(location.row);

  return row ? row.childCount : 0;
}

/** How many rows the table the selection is in has, or `0`. */
export function tableRowCount(state: EditorState): number {
  return tableAtSelection(state)?.node.childCount ?? 0;
}

/** The target a table command takes, derived from where the selection is. */
export function tableTargetAtSelection(state: EditorState): null | TableTarget {
  const location = tableAtSelection(state);

  return location ? { column: location.cell, pos: location.tablePos, row: location.row } : null;
}

/** Index of the cell the position sits in, counted in cells rather than visual columns. */
function cellIndex($from: ResolvedPos, tableDepth: number): number {
  return tableDepth + 2 <= $from.depth ? $from.index(tableDepth + 2) : 0;
}

/** Index of the row the position sits in. */
function rowIndex($from: ResolvedPos, tableDepth: number): number {
  return tableDepth + 1 <= $from.depth ? $from.index(tableDepth + 1) : 0;
}

/** The table selected as a whole, or `null`. */
function selectedTable(state: EditorState): { node: DocNode; pos: number } | null {
  const { selection } = state;

  if (selection.empty || selection.to - selection.from < 1) {
    return null;
  }

  const node = state.doc.nodeStartingAt(selection.from);

  return node && node.name === 'table' ? { node, pos: selection.from } : null;
}
