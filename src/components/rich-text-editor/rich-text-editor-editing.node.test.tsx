import { describe, expect, it } from 'vitest';

import type { NodeJSON } from './rich-text-editor-lib.ts';

import { extendedKit } from './rich-text-editor-extensions';
import { Editor as EditorClass, StarterKit, TextSelection } from './rich-text-editor-lib.ts';

const paragraph = (text = ''): NodeJSON => ({
  ...(text ? { content: [{ text, type: 'text' }] } : {}),
  type: 'paragraph',
});

const heading = (text: string): NodeJSON => ({
  attrs: { level: 2 },
  content: [{ text, type: 'text' }],
  type: 'heading',
});

const editorAt = (content: NodeJSON[], position: number): EditorClass => {
  const editor = new EditorClass({ content: { content, type: 'doc' }, extensions: [StarterKit] });

  editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, position)));

  return editor;
};

describe('Editing and caret regressions', () => {
  it.each([1, 3, 5])('inserts a newline inside a code block at %s', (position) => {
    const editor = editorAt(
      [
        {
          attrs: { language: 'javascript' },
          content: [{ text: 'abcd', type: 'text' }],
          type: 'code_block',
        },
      ],
      position,
    );
    expect(editor.runKey({ key: 'Enter' })).toBe(true);
    expect(editor.state.doc.childCount).toBe(1);
    expect(editor.state.doc.child(0).textContent).toBe(
      'abcd'.slice(0, position - 1) + '\n' + 'abcd'.slice(position - 1),
    );
    expect(editor.state.selection.from).toBe(position + 1);
  });

  it('replaces a selection inside code with a newline rather than splitting the block', () => {
    const editor = editorAt([{ content: [{ text: 'abcd', type: 'text' }], type: 'code_block' }], 2);
    editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 2, 4)));
    expect(editor.runKey({ key: 'Enter' })).toBe(true);
    expect(editor.state.doc.childCount).toBe(1);
    expect(editor.state.doc.child(0).textContent).toBe('a\nd');
    expect(editor.state.selection.from).toBe(3);
  });

  it.each([1, 2, 3])(
    'inserts a symbol beside an existing emoji or inside text at %s',
    (position) => {
      const editor = new EditorClass({
        content: { content: [paragraph('text')], type: 'doc' },
        extensions: [StarterKit, extendedKit()],
      });
      editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 1)));
      expect(editor.runNamedCommand('insertEmoji', { char: '😄', name: 'grin' })).toBe(true);
      editor.dispatch(
        editor.state.tr.setSelection(TextSelection.create(editor.state.doc, position)),
      );
      expect(editor.runNamedCommand('insertSymbol', { char: '×', name: 'multiply' })).toBe(true);
    },
  );
  it('creates a paragraph above a heading and keeps the caret in that new line', () => {
    const editor = editorAt([heading('Title')], 1);

    expect(editor.runKey({ key: 'Enter' })).toBe(true);
    expect(editor.state.doc.toJSON().content?.map((node) => node.type)).toEqual([
      'paragraph',
      'heading',
    ]);
    expect(editor.state.selection.from).toBe(1);

    expect(editor.runNamedCommand('insertText', { text: 'before' })).toBe(true);
    expect(editor.state.doc.child(0).textContent).toBe('before');
    expect(editor.state.doc.child(1).textContent).toBe('Title');
  });

  it('leaves a heading at its end and starts a paragraph below it', () => {
    const editor = editorAt([heading('Title')], 6);

    expect(editor.runKey({ key: 'Enter' })).toBe(true);
    expect(editor.state.doc.toJSON().content?.map((node) => node.type)).toEqual([
      'heading',
      'paragraph',
    ]);
    expect(editor.state.selection.from).toBe(8);
  });

  it.each([
    ['before', 3, ['paragraph', 'paragraph', 'horizontal_rule', 'paragraph']],
    ['after', 4, ['paragraph', 'horizontal_rule', 'paragraph', 'paragraph']],
  ] as const)('creates an editable line %s a horizontal rule', (_side, position, types) => {
    const editor = editorAt(
      [paragraph('a'), { type: 'horizontal_rule' }, paragraph('b')],
      position,
    );

    expect(editor.runKey({ key: 'Enter' })).toBe(true);
    expect(editor.state.doc.toJSON().content?.map((node) => node.type)).toEqual(types);
    expect(editor.state.selection.$from.node(1).name).toBe('paragraph');
  });
});
