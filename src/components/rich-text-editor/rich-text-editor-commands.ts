import type { Attrs, Command, Extension, ExtensionContext } from './rich-text-editor-lib.ts';

import { blockAt, setBlockAttributes } from './rich-text-editor-utils';

/**
 * The commands the toolbar needs and the engine does not register.
 *
 * The engine registers what a document model can decide on its own: the alignment values are fixed,
 * a heading level is a number, and a mark is either on or off. The controls below are the other
 * kind — a value the *user* picked, such as a line height, a paragraph margin, a code block's
 * language — so they are factories over that value and are registered here rather than hard-coded
 * in the engine.
 *
 * ```ts
 * editor.commands.setLineHeight({ lineHeight: 1.5 });
 * editor.commands.setParagraphSpacing({ marginBottom: 12, marginTop: 0 });
 * ```
 */
export function editorCommands(
  _context: ExtensionContext,
): Record<string, (options?: Attrs) => Command> {
  return {
    // A toolbar button that owns its own behaviour — the clipboard, a dialog, the painter — still
    // reads its own enabled state through `can`, so it needs a name to ask about. These entries
    // report whether the action could run at all and do nothing when they do run, which is exactly
    // the contract a disabled button needs.
    copySelection: () => () => false,
    cutSelection: () => () => false,
    pasteFromClipboard: () => () => false,
    pastePlainText: () => () => false,
    setCodeBlockLanguage: (options) => setCodeBlockLanguage(options?.language),
    setLineHeight: (options) => setLineHeight(options?.lineHeight),
    setParagraphSpacing: (options) =>
      setParagraphSpacing({
        marginBottom: options?.marginBottom,
        marginTop: options?.marginTop,
      }),
  };
}

/** The extension that registers the toolbar-only commands. */
export function editorKit(): Extension {
  return {
    addCommands: editorCommands,
    name: 'richTextEditor',
    // Below the starter kit: a host extension may redefine one of these names, and the engine's own
    // commands must never be shadowed by a control the toolbar merely drives.
    priority: -100,
  };
}

/** Sets the language of the code block the selection is in. */
export function setCodeBlockLanguage(language: unknown): Command {
  const value = language === undefined || language === null ? '' : String(language);

  return (state, dispatch) => {
    const block = blockAt(state);

    if (!block || block.node.name !== 'code_block') {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;

    tr.setNodeAttrs(block.pos, block.node.type, { language: value === '' ? null : value });
    tr.setMeta('historyGroup', 'block');
    dispatch(tr);

    return true;
  };
}

/**
 * Sets the line height of every block the selection touches.
 *
 * A `null` value removes the attribute, which is how the picker's "default" row puts a block back
 * to whatever the stylesheet says rather than to a number of its own.
 */
export function setLineHeight(lineHeight: unknown): Command {
  return setBlockAttributes({ lineHeight: normalizeSpacing(lineHeight) });
}

/** Sets the top and bottom margin of every block the selection touches. */
export function setParagraphSpacing(attrs: {
  marginBottom?: unknown;
  marginTop?: unknown;
}): Command {
  const spacing: Attrs = {};

  if ('marginTop' in attrs) {
    spacing.marginTop = normalizeSpacing(attrs.marginTop);
  }

  if ('marginBottom' in attrs) {
    spacing.marginBottom = normalizeSpacing(attrs.marginBottom);
  }

  return setBlockAttributes(spacing);
}

/**
 * A spacing value the editor's presentation policy accepts.
 *
 * Numbers are pixels, a string is kept as a CSS length, and anything else becomes `null`, which
 * removes the attribute. A value the policy would refuse makes the block render as if the command
 * had never run, so it is dropped here instead of being written into the document.
 */
function normalizeSpacing(value: unknown): null | number | string {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  const text = String(value).trim();

  if (text === '') {
    return null;
  }

  const parsed = Number(text);

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  return /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:ch|cm|em|ex|in|mm|pc|pt|px|q|rem|vh|vmax|vmin|vw|%|)$/.test(
    text,
  )
    ? text
    : null;
}
