import type { Command } from '../command/command.ts';
import type { Extension, ExtensionContext } from '../extension/extension.ts';
import type { NodeJSON } from '../model/node.ts';
import type { NodeSpec } from '../schema/node-spec.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { Attrs } from '../util/object.ts';

import { setHeading, setParagraph, setTextAlign } from '../command/block-commands.ts';
import { chainCommands } from '../command/command.ts';
import {
  indent,
  insertHorizontalRule,
  outdent,
  toggleBlockquote,
  toggleBulletList,
  toggleCodeBlock,
  toggleOrderedList,
  toggleTaskList,
} from '../command/list-commands.ts';
import {
  markActive,
  marksInSelection,
  setMark,
  toggleMark,
  unsetMark,
} from '../command/mark-commands.ts';
import { insertLink, unsetLink } from '../command/mark-commands.ts';
import {
  deleteNode,
  insertBlock,
  moveToNodeEdge,
  replaceNode,
  selectNode,
  updateNode,
} from '../command/node-commands.ts';
import { history, historyKey, REDO_META, UNDO_META } from '../history/history-plugin.ts';
import { basicInputRules, inputRules } from '../plugins/input-rules.ts';
import { inlineStyleValue, linkTargetValue, safeLinkRel } from '../serialization/presentation.ts';
import { urlPolicy } from '../serialization/sanitize.ts';
import {
  createParagraphNear,
  deleteBackward,
  deleteForward,
  deleteSelection,
  insertText,
  joinBackward,
  joinForward,
  selectAll,
  splitBlock,
} from '../transform-commands/basic-editing.ts';

/** A node or mark spec, without the `name` which the schema fills in. */
type Spec = Omit<NodeSpec, 'name'>;

/** The document node every schema needs. */
export const doc: NodeSpec = { content: 'block+', name: 'doc' };

/** Plain text. */
export const text: NodeSpec = { group: 'inline', name: 'text' };

/** A paragraph, with the alignment and spacing attributes from the design. */
export const paragraph: NodeSpec = {
  attrs: {
    align: { default: 'left' },
    indent: { default: 0 },
    lineHeight: { default: null },
    marginBottom: { default: null },
    marginTop: { default: null },
  },
  content: 'inline*',
  group: 'block',
  name: 'paragraph',
};

/** Heading levels H1 to H6. */
export const heading: NodeSpec = {
  attrs: {
    align: { default: 'left' },
    level: { default: 1, validate: (value) => Number(value) >= 1 && Number(value) <= 6 },
  },
  content: 'inline*',
  group: 'block',
  name: 'heading',
};

/** A blockquote wrapping other blocks. */
export const blockquote: NodeSpec = {
  content: 'block+',
  defining: true,
  group: 'block',
  name: 'blockquote',
};

/** An unordered list. */
export const bulletList: NodeSpec = { content: 'list_item+', group: 'block', name: 'bullet_list' };

/** An ordered list. */
export const orderedList: NodeSpec = {
  attrs: { order: { default: 1 } },
  content: 'list_item+',
  group: 'block',
  name: 'ordered_list',
};

/** One entry of a list. */
export const listItem: NodeSpec = {
  content: 'paragraph block*',
  defining: true,
  name: 'list_item',
  selectable: false,
};

/** A checklist. */
export const taskList: NodeSpec = { content: 'task_item+', group: 'block', name: 'task_list' };

/** One entry of a checklist; the checkbox state is a node attribute. */
export const taskItem: NodeSpec = {
  attrs: { checked: { default: false } },
  content: 'paragraph block*',
  defining: true,
  name: 'task_item',
};

/** A code block; syntax highlighting belongs to the view layer. */
export const codeBlock: NodeSpec = {
  attrs: {
    language: { default: null },
    lineNumbers: { default: false },
    theme: { default: null },
  },
  code: true,
  content: 'text*',
  defining: true,
  group: 'block',
  marks: '',
  name: 'code_block',
};

/** A horizontal rule. */
export const horizontalRule: NodeSpec = { group: 'block', name: 'horizontal_rule' };

/** Inline marks shipped by default. */
export const bold = { name: 'bold' };
export const italic = { name: 'italic' };
export const underline = { name: 'underline' };
export const strike = { name: 'strike' };
export const inlineCode = { name: 'inline_code' };
export const superscript = { name: 'superscript' };
export const subscript = { name: 'subscript' };
export const link = {
  attrs: {
    /**
     * Where the link points.
     *
     * The URL policy is applied while the attribute is normalized, so a dangerous URL cannot
     * become a link in the first place: `Schema.nodeFromJSON` — which is how a document from
     * storage, a host or a test fixture enters the model — builds marks through this same
     * attribute computer. Dropping the attribute is what makes the refusal stick: the mark
     * survives with no destination and renders as an `<a>` a click cannot follow.
     */
    href: {
      compute: (value: unknown): unknown => {
        if (value === null || value === undefined) {
          return null;
        }

        const href = urlPolicy.sanitize(String(value));

        return href === '' ? undefined : href;
      },
    },
    rel: {
      compute: (value: unknown, attrs: Attrs): unknown => safeLinkRel(attrs.target, value),
      default: null,
    },
    target: {
      compute: (value: unknown): unknown => linkTargetValue(value),
      default: null,
    },
    title: { default: null },
  },
  inclusive: false,
  name: 'link',
};
export const textColor = {
  attrs: { color: { compute: (value: unknown) => inlineStyleValue('color', value) ?? undefined } },
  excludes: ['color'],
  name: 'text_color',
};
export const highlight = {
  attrs: { color: { compute: (value: unknown) => inlineStyleValue('color', value) ?? undefined } },
  excludes: ['color'],
  name: 'highlight',
};
export const fontFamily = {
  attrs: {
    family: {
      compute: (value: unknown) => inlineStyleValue('font-family', value) ?? undefined,
    },
  },
  excludes: ['family'],
  name: 'font_family',
};
export const fontSize = {
  attrs: {
    size: { compute: (value: unknown) => inlineStyleValue('font-size', value) ?? undefined },
  },
  excludes: ['size'],
  name: 'font_size',
};

/** Commands the default schema understands. */
export function basicCommands(
  _context: ExtensionContext,
): Record<string, (options?: Attrs) => Command> {
  return {
    clearFormatting: () => clearFormatting(),
    deleteNode: (options) => deleteNode(Number(options?.pos ?? -1)),
    deleteSelection,
    indent: () => indent(),
    insertBlock: (options) =>
      insertBlock(
        options?.content as NodeJSON,
        options?.pos === undefined ? undefined : Number(options.pos),
      ),
    insertHorizontalRule: () => insertHorizontalRule(),
    insertLink: (options) =>
      insertLink({
        href: String(options?.href ?? ''),
        // `rel` is forwarded because the safe token filter runs on it: a command that dropped the
        // value would silently refuse a host its `sponsored` or `nofollow`, and `linkAttrsFrom`
        // is what decides which tokens survive rather than what a caller may ask for.
        rel: options?.rel === undefined ? undefined : String(options.rel),
        target: options?.target as '_blank' | '_self' | undefined,
        text: options?.text === undefined ? undefined : String(options.text),
        title: options?.title === undefined ? undefined : String(options.title),
      }),
    insertText: (options) => insertText(String(options?.text ?? '')),
    joinBackward,
    joinForward,
    moveToNodeEdge: (options) =>
      moveToNodeEdge(Number(options?.pos ?? -1), options?.side === 'after' ? 'after' : 'before'),
    outdent: () => outdent(),
    redo: () => redo(),
    replaceNode: (options) => replaceNode(Number(options?.pos ?? -1), options?.content as NodeJSON),
    selectAll,
    selectNode: (options) => selectNode(Number(options?.pos ?? -1)),
    setFontFamily: (options) =>
      setNamedMark('font_family', { family: String(options?.family ?? '') }),
    setFontSize: (options) => setNamedMark('font_size', { size: String(options?.size ?? '') }),
    setHeading: (options) => setHeading(Number(options?.level ?? 1)),
    setHighlight: (options) => setNamedMark('highlight', { color: String(options?.color ?? '') }),
    setParagraph,
    setTextAlign: (options) =>
      setTextAlign((options?.align ?? 'left') as 'center' | 'justify' | 'left' | 'right'),
    setTextColor: (options) => setNamedMark('text_color', { color: String(options?.color ?? '') }),
    splitBlock,
    toggleBlockquote: () => toggleBlockquote(),
    toggleBold: () => toggleNamedMark('bold'),
    toggleBulletList: () => toggleBulletList(),
    toggleCodeBlock: () => toggleCodeBlock(),
    toggleInlineCode: () => toggleNamedMark('inline_code'),
    toggleItalic: () => toggleNamedMark('italic'),
    toggleOrderedList: () => toggleOrderedList(),
    toggleStrike: () => toggleNamedMark('strike'),
    toggleSubscript: () => toggleNamedMark('subscript'),
    toggleSuperscript: () => toggleNamedMark('superscript'),
    toggleTaskList: () => toggleTaskList(),
    toggleUnderline: () => toggleNamedMark('underline'),
    undo: () => undo(),
    unsetFontFamily: () => unsetNamedMark('font_family'),
    unsetFontSize: () => unsetNamedMark('font_size'),
    unsetHighlight: () => unsetNamedMark('highlight'),
    unsetLink: () => unsetLink(),
    unsetTextColor: () => unsetNamedMark('text_color'),
    updateNode: (options) =>
      updateNode(Number(options?.pos ?? -1), (options?.attrs ?? {}) as Attrs),
  };
}

/** Keyboard shortcuts of the default extension. */
export function basicKeymap(): Record<string, Command> {
  return {
    Backspace: chainCommands(deleteSelection(), deleteBackward(), joinBackward()),
    Delete: chainCommands(deleteSelection(), deleteForward(), joinForward()),
    Enter: chainCommands(createParagraphNear(), splitBlock()),
    'Mod-a': selectAll(),
    'Mod-b': toggleNamedMark('bold'),
    'Mod-e': toggleNamedMark('inline_code'),
    'Mod-i': toggleNamedMark('italic'),
    'Mod-u': toggleNamedMark('underline'),
    'Mod-z': undo(),
    'Shift-Enter': splitBlock(),
    'Shift-Mod-x': toggleNamedMark('strike'),
    'Shift-Mod-z': redo(),
  };
}

/** Every mark spec of the default schema, keyed by name. */
export function basicMarks() {
  return {
    bold,
    font_family: fontFamily,
    font_size: fontSize,
    highlight,
    inline_code: inlineCode,
    italic,
    link,
    strike,
    subscript,
    superscript,
    text_color: textColor,
    underline,
  };
}

/** Every block spec of the default schema, keyed by name. */
export function basicNodes(): Record<string, NodeSpec> {
  return {
    blockquote,
    bullet_list: bulletList,
    code_block: codeBlock,
    doc,
    heading,
    horizontal_rule: horizontalRule,
    list_item: listItem,
    ordered_list: orderedList,
    paragraph,
    task_item: taskItem,
    task_list: taskList,
    text,
  };
}

/** Removes every mark from the selection, keeping the block structure. */
export function clearFormatting(): Command {
  return (state, dispatch) => {
    const { from, to } = state.selection;
    const { empty } = state.selection;

    if (empty) {
      if (!dispatch) {
        return true;
      }

      const tr = state.tr.setStoredMark(null);

      tr.setMeta('historyGroup', 'mark');
      dispatch(tr);

      return true;
    }

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

/** Whether the named mark is active at the selection. */
export function namedMarkActive(name: string, attrs?: Attrs): (state: EditorState) => boolean {
  return (state) => {
    const type = state.schema.marks[name];

    return type ? markActive(state, type, attrs) : false;
  };
}

/** Redoes the last undone edit. */
export function redo(): Command {
  return (state, dispatch) => {
    const historyState = historyKey.getState(state);

    if (!historyState || historyState.undone.length === 0) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    dispatch(state.tr.setMeta(REDO_META, true));

    return true;
  };
}

/** Adds the mark registered under `name` with `attrs`, replacing any of its type. */
export function setNamedMark(name: string, attrs: Attrs): Command {
  return (state, dispatch) => {
    const type = state.schema.marks[name];

    return type ? setMark(type, attrs)(state, dispatch) : false;
  };
}

/**
 * The starter kit: the schema, commands and shortcuts every editor gets.
 *
 * It is a single extension so that `new Editor({ content })` works without a spec,
 * and users can still replace any piece by registering their own extension with a
 * higher priority.
 *
 * Its options name the schema's shape: `topNode` (default `"doc"`) and `initialBlock`
 * (default `"paragraph"`), the block a blank editor starts with.
 */
export function starterKit(): Extension {
  return {
    addCommands: basicCommands,
    addInputRules: (context) => basicInputRules(context.schema.nodes, context.schema.marks),
    addKeyboardShortcuts: () => basicKeymap(),
    addMarks: () => basicMarks(),
    addNodes: () => basicNodes(),
    addPlugins: (context) => [
      history(context.editor.historyOptions ?? {}),
      inputRules(basicInputRules(context.schema.nodes, context.schema.marks)),
    ],
    name: 'starterKit',
    /** A blank editor starts with a paragraph, not with whichever block the schema lists first. */
    options: { initialBlock: 'paragraph' },
    priority: 1000,
  };
}

/** Toggles the mark registered under `name`. */
export function toggleNamedMark(name: string, attrs: Attrs = {}): Command {
  return (state, dispatch) => {
    const type = state.schema.marks[name];

    return type ? toggleMark(type, attrs)(state, dispatch) : false;
  };
}

/** Undoes the last edit. */
export function undo(): Command {
  return (state, dispatch) => {
    const historyState = historyKey.getState(state);

    if (!historyState || historyState.done.length === 0) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    dispatch(state.tr.setMeta(UNDO_META, true));

    return true;
  };
}

/** Removes the mark registered under `name` from the selection. */
export function unsetNamedMark(name: string): Command {
  return (state, dispatch) => {
    const type = state.schema.marks[name];

    return type ? unsetMark(type)(state, dispatch) : false;
  };
}

/** Re-exported so the schema module can build a document from JSON. */
export type { NodeJSON, Spec };

/** The starter kit, as a single extension instance. */
export const StarterKit = starterKit();
