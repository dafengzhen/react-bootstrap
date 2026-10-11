import { describe, expect, it } from 'vitest';

import type { NodeJSON } from './rich-text-editor-lib.ts';

import {
  createTable,
  Editor as EditorClass,
  StarterKit,
  TableKit,
  TextSelection,
} from './rich-text-editor-lib.ts';
import {
  canEditTable,
  tableAtSelection,
  tableColumnCount,
  tableRowCount,
  tableTargetAtSelection,
} from './rich-text-editor-table-utils';

/** A document holding one table. */
const docWithTable = (table: NodeJSON): NodeJSON => ({ content: [table], type: 'doc' });

/** A table whose first cell spans two rows, which is what makes it unmergeable. */
const spanningTable = (): NodeJSON => ({
  content: [
    {
      content: [
        {
          content: [
            {
              attrs: { colspan: 1, rowspan: 2 },
              content: [{ content: [{ text: 'a', type: 'text' }], type: 'paragraph' }],
              type: 'table_cell',
            },
            {
              attrs: { colspan: 1, rowspan: 1 },
              content: [{ content: [{ text: 'b', type: 'text' }], type: 'paragraph' }],
              type: 'table_cell',
            },
          ],
          type: 'table_row',
        },
        {
          content: [
            {
              attrs: { colspan: 1, rowspan: 1 },
              content: [{ content: [{ text: 'c', type: 'text' }], type: 'paragraph' }],
              type: 'table_cell',
            },
          ],
          type: 'table_row',
        },
      ],
      type: 'table',
    },
  ],
  type: 'doc',
});

/** Creates an editor with the caret inside the first cell of `content`. */
function editorIn(content: NodeJSON, position = 3) {
  const editor = new EditorClass({ content, extensions: [StarterKit, TableKit] });

  editor.runCommand((state, dispatch) => {
    dispatch?.(state.tr.setSelection(TextSelection.create(state.tr.doc, position)));

    return true;
  });

  return editor;
}

describe('table utils', () => {
  it('reads the caret cell of a plain table', () => {
    const editor = editorIn(docWithTable(createTable(2, 2)));

    expect(tableAtSelection(editor.state)).toMatchObject({ cell: 0, row: 0, tablePos: 0 });
    expect(tableRowCount(editor.state)).toBe(2);
    expect(tableColumnCount(editor.state)).toBe(2);
    expect(tableTargetAtSelection(editor.state)).toEqual({ column: 0, pos: 0, row: 0 });
    expect(canEditTable(editor.state)).toBe(true);
  });

  it('reports no table when the caret is outside one', () => {
    const editor = editorIn({
      content: [{ content: [{ text: 'plain', type: 'text' }], type: 'paragraph' }],
      type: 'doc',
    });

    expect(tableAtSelection(editor.state)).toBeNull();
    expect(canEditTable(editor.state)).toBe(false);
    expect(tableRowCount(editor.state)).toBe(0);
  });

  it('refuses structural edits on a table with a vertical span', () => {
    const editor = editorIn(spanningTable());

    const location = tableAtSelection(editor.state);

    expect(location).not.toBeNull();
    expect(canEditTable(editor.state)).toBe(false);
  });

  it('allows structural edits after a horizontal merge', () => {
    const editor = editorIn(docWithTable(createTable(1, 2)));

    expect(editor.runNamedCommand('mergeTableCells', { column: 0, pos: 0, row: 0 })).toBe(true);

    // Replacing the table node moves the selection with it, and the panel reads the caret, so the
    // caret is put back where a user's click would put it.
    editor.runCommand((state, dispatch) => {
      dispatch?.(state.tr.setSelection(TextSelection.create(state.tr.doc, 3)));

      return true;
    });

    expect(canEditTable(editor.state)).toBe(true);
    expect(tableColumnCount(editor.state)).toBe(1);
  });

  it('counts cells rather than visual columns', () => {
    const editor = editorIn(
      docWithTable({
        content: [
          {
            content: [
              {
                attrs: { colspan: 2, rowspan: 1 },
                content: [{ content: [{ text: 'wide', type: 'text' }], type: 'paragraph' }],
                type: 'table_cell',
              },
              {
                attrs: { colspan: 1, rowspan: 1 },
                content: [{ content: [{ text: 'third', type: 'text' }], type: 'paragraph' }],
                type: 'table_cell',
              },
            ],
            type: 'table_row',
          },
        ],
        type: 'table',
      }),
    );

    // The row covers three visual columns in two cells, and the panel addresses cells.
    expect(tableColumnCount(editor.state)).toBe(2);
    expect(canEditTable(editor.state)).toBe(true);
  });
});
