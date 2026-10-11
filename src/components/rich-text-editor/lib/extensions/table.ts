import type { Command } from '../command/command.ts';
import type { Extension } from '../extension/extension.ts';
import type { NodeJSON } from '../model/node.ts';
import type { EditorState } from '../state/editor-state.ts';

import { insertBlock, replaceNode } from '../command/node-commands.ts';

/** A table cell addressed by table position, row and cell index (not visual column). */
export interface TableTarget {
  column?: number;
  pos?: number;
  row?: number;
}

/** Construct table JSON. Text is optional and supplied by the host, never by the core locale. */
export function createTable(
  rows = 3,
  columns = 3,
  text?: (row: number, column: number) => string,
): NodeJSON {
  if (
    !Number.isInteger(rows) ||
    !Number.isInteger(columns) ||
    rows < 1 ||
    columns < 1 ||
    rows > 100 ||
    columns > 100
  ) {
    throw new RangeError('Table dimensions must be integers between 1 and 100');
  }
  return {
    content: Array.from({ length: rows }, (_, row) => ({
      content: Array.from({ length: columns }, (_, column) => {
        const value = text?.(row, column) ?? '';
        return {
          attrs: { colspan: 1, rowspan: 1 },
          content: [{ content: value ? [{ text: value, type: 'text' }] : [], type: 'paragraph' }],
          type: 'table_cell',
        };
      }),
      type: 'table_row',
    })),
    type: 'table',
  };
}

/** Optional, headless table schema and commands; DOM rendering is provided by the view layer. */
export const TableKit: Extension = {
  addCommands: () => ({
    addTableColumn: (options) => editTable('column', options as TableTarget),
    addTableRow: (options) => editTable('row', options as TableTarget),
    insertTable: (options) => {
      try {
        return insertBlock(
          createTable(Number(options?.rows ?? 3), Number(options?.columns ?? 3)),
          options?.pos as number | undefined,
        );
      } catch {
        return () => false;
      }
    },
    mergeTableCells: (options) => editTable('merge', options as TableTarget),
    setTableCellText: (options) =>
      editTable('text', options as TableTarget, String(options?.text ?? '')),
  }),
  addNodes: () => ({
    table: { content: 'table_row+', group: 'block', name: 'table' },
    table_cell: {
      attrs: { colspan: { default: 1, validate: span }, rowspan: { default: 1, validate: span } },
      content: 'paragraph+',
      isolating: true,
      name: 'table_cell',
    },
    table_row: { content: 'table_cell+', name: 'table_row' },
  }),
  name: 'table',
};

function editTable(
  action: 'column' | 'merge' | 'row' | 'text',
  target: TableTarget = {},
  text = '',
): Command {
  return (state, dispatch) => {
    const pos = targetPosition(state, target.pos);
    if (pos === null) {
      return false;
    }
    const json = state.doc.nodeStartingAt(pos)!.toJSON();
    const rows = json.content!;
    const row = target.row ?? 0;
    const column = target.column ?? 0;
    if (!Number.isInteger(row) || !Number.isInteger(column) || row < 0 || column < 0) {
      return false;
    }
    const cells = rows[row]?.content;
    const cell = cells?.[column];
    if (!cell || !cells) {
      return false;
    }
    // Structural operations decline vertically merged or ragged tables rather than corrupt spans.
    if (
      action !== 'text' &&
      rows.some((row) => row.content!.some((cell) => Number(cell.attrs?.rowspan ?? 1) !== 1))
    ) {
      return false;
    }
    const width = (cells: NodeJSON[]) =>
      cells.reduce((sum, cell) => sum + Number(cell.attrs?.colspan ?? 1), 0);
    if (action !== 'text' && rows.some((row) => width(row.content!) !== width(cells))) {
      return false;
    }
    if (action === 'text') {
      cell.content = [{ content: text ? [{ text, type: 'text' }] : [], type: 'paragraph' }];
    } else if (action === 'row') {
      if (rows.length >= 100 || width(cells) > 100) {
        return false;
      }
      rows.splice(row + 1, 0, createTable(1, width(cells)).content![0]!);
    } else if (action === 'column') {
      if (width(cells) >= 100) {
        return false;
      }
      const boundary = width(cells.slice(0, column + 1));
      for (const row of rows) {
        let offset = 0;
        for (let index = 0; index < row.content!.length; index++) {
          const current = row.content![index]!;
          const end = offset + Number(current.attrs?.colspan ?? 1);
          if (end === boundary) {
            row.content!.splice(index + 1, 0, createTable(1, 1).content![0]!.content![0]!);
            break;
          }
          if (offset < boundary && end > boundary) {
            current.attrs = { ...current.attrs, colspan: Number(current.attrs?.colspan ?? 1) + 1 };
            break;
          }
          offset = end;
        }
      }
    } else {
      const next = cells[column + 1];
      if (!next) {
        return false;
      }
      cell.attrs = {
        ...cell.attrs,
        colspan: Number(cell.attrs?.colspan ?? 1) + Number(next.attrs?.colspan ?? 1),
      };
      cell.content = [...cell.content!, ...next.content!];
      cells.splice(column + 1, 1);
    }
    return replaceNode(pos, json)(state, dispatch);
  };
}

function span(value: unknown): boolean {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function targetPosition(state: EditorState, pos?: number): null | number {
  if (pos !== undefined) {
    return state.doc.nodeStartingAt(pos)?.name === 'table' ? pos : null;
  }
  const selected = state.doc.nodeStartingAt(state.selection.from);
  if (selected?.name === 'table') {
    return state.selection.from;
  }
  for (let depth = state.selection.$from.depth; depth > 0; depth--) {
    if (state.selection.$from.node(depth).name === 'table') {
      return state.selection.$from.before(depth);
    }
  }
  return null;
}
