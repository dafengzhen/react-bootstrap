import type { InputRule } from '../extension/extension.ts';
import type { MarkType } from '../model/mark-type.ts';
import type { NodeType } from '../model/node-type.ts';
import type { Node } from '../model/node.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { Transaction } from '../state/transaction.ts';

import { RESTORE_META } from '../history/history-plugin.ts';
import { TextSelection } from '../selection/text-selection.ts';
import { PluginKey } from '../state/plugin-key.ts';
import { Plugin } from '../state/plugin.ts';

/** Key under which the input rule state lives. */
export const inputRulesKey = new PluginKey('inputRules');

/** Metadata key marking a transaction the rules produced themselves. */
export const INPUT_RULE_META = 'inputRule';

/** The default markdown style input rules of the starter kit. */
export function basicInputRules(
  nodes: Record<string, NodeType>,
  marks: Record<string, MarkType>,
): InputRule[] {
  const rules: InputRule[] = [];

  if (nodes.heading) {
    rules.push(headingRule(nodes.heading, 1));
  }

  if (nodes.bullet_list && nodes.list_item) {
    rules.push(listRule(nodes.bullet_list, nodes.list_item, /^[-*+]\s$/));
  }

  if (nodes.ordered_list && nodes.list_item) {
    rules.push(listRule(nodes.ordered_list, nodes.list_item, /^\d+\.\s$/));
  }

  if (nodes.blockquote) {
    rules.push(blockquoteRule(nodes.blockquote));
  }

  if (nodes.code_block) {
    rules.push(codeBlockRule(nodes.code_block));
  }

  if (marks.bold) {
    rules.push(emphasisRule(marks.bold, /\*\*([^*]+)\*\*$/, ['*']));
  }

  if (marks.italic) {
    rules.push(emphasisRule(marks.italic, /(?:\*|_)([^*_]+)(?:\*|_)$/, ['*', '_']));
  }

  if (marks.inline_code) {
    rules.push(emphasisRule(marks.inline_code, /`([^`]+)`$/, ['`']));
  }

  if (marks.strike) {
    rules.push(emphasisRule(marks.strike, /~~([^~]+)~~$/, ['~']));
  }

  return rules;
}

/** Rule that turns `> ` at the start of a block into a blockquote. */
export function blockquoteRule(type: NodeType): InputRule {
  return {
    handler: wrapBlockHandler((node) => type.create(undefined, [node]), 1),
    pattern: /^>\s$/,
  };
}

/**
 * Rule that turns ```` ``` ```` into a code block.
 *
 * The text after the backticks becomes the language of the block, so ```` ```ts ```` starts a
 * TypeScript code block.
 */
export function codeBlockRule(type: NodeType): InputRule {
  return {
    handler: (state, match) => {
      const block = blockAt(state);

      if (!block) {
        return null;
      }

      const language = match[1] ? match[1] : null;

      return rebuildBlock(state, block.pos, match[0].length, (node) =>
        type.create({ ...node.attrs, language }, node.textContent),
      );
    },
    pattern: /^```([a-zA-Z0-9+#-]*)\s$/,
  };
}

/**
 * Rule that marks the text between two emphasis markers.
 *
 * `markers` are the characters the pattern is built from. A match preceded by one of them is
 * refused, which is what keeps `*italic*` from firing halfway through typing `**bold**`: at that
 * point the run is a longer marker, not emphasis.
 */
export function emphasisRule(
  mark: MarkType,
  pattern: RegExp,
  markers?: readonly string[],
): InputRule {
  return {
    handler: (state, match) => {
      const $from = state.selection.$from;
      const typed = $from.parent.textBetween(0, $from.parentOffset(), undefined);

      if (markers?.includes(typed.charAt(typed.length - match[0].length - 1))) {
        return null;
      }

      const from = state.selection.from - match[0].length;
      const text = match[1] ?? '';
      const to = from + text.length;
      const tr = state.tr;

      tr.delete(from, state.selection.from);
      tr.insert(from, text);
      tr.addMark(from, to, mark.create());
      tr.setSelection(TextSelection.create(tr.doc, to));

      return tr;
    },
    pattern,
  };
}

/**
 * Rule that turns `# ` at the start of a block into a heading.
 *
 * The marker decides the level, so `### ` produces a level three heading even when the rule was
 * installed with level one.
 */
export function headingRule(type: NodeType, level: number, pattern = /^(#{1,6})\s$/): InputRule {
  return {
    handler: (state, match) => {
      const block = blockAt(state);

      if (!block) {
        return null;
      }

      const headingLevel = match[1] ? match[1].length : level;

      return rebuildBlock(state, block.pos, match[0].length, (node) =>
        type.create({ ...node.attrs, level: headingLevel }, node.content),
      );
    },
    pattern,
  };
}

/**
 * An input rule reacts to text that was just typed.
 *
 * Rules are what turn `# ` into a heading, `- ` into a list and `**bold**` into a bold run — the
 * shortcuts users expect from a modern editor. A rule returns a transaction, or `null` when it
 * does not match.
 */
export function inputRules(rules: readonly InputRule[]): Plugin {
  return new Plugin({
    appendTransaction: (transactions, _oldState, newState) => {
      // Rules react to typing only. A history restore puts the typed markers back on screen, and
      // running the rules again would immediately undo the undo; the rules' own follow-up
      // transactions are skipped for the same reason.
      if (
        transactions.some((tr) => tr.getMeta(RESTORE_META) || tr.getMeta(INPUT_RULE_META)) ||
        !transactions.some((tr) => tr.docChanged)
      ) {
        return null;
      }

      const applied = applyRules(newState, rules);

      if (applied) {
        applied.setMeta(INPUT_RULE_META, true);
      }

      return applied;
    },
    key: inputRulesKey,
  });
}

/** Rule that wraps the current block in a list when `- ` or `1. ` is typed. */
export function listRule(listType: NodeType, itemType: NodeType, pattern: RegExp): InputRule {
  return {
    handler: wrapBlockHandler(
      (node) => listType.create(undefined, [itemType.create(undefined, [node])]),
      2,
    ),
    pattern,
  };
}

/** Tries every rule against the text in front of the cursor. */
function applyRules(state: EditorState, rules: readonly InputRule[]): null | Transaction {
  const selection = state.selection;

  if (!selection.empty) {
    return null;
  }

  const $from = selection.$from;
  const textBefore = $from.parent.textBetween(
    Math.max(0, $from.parentOffset() - 32),
    $from.parentOffset(),
    undefined,
  );

  for (const rule of rules) {
    const match = rule.pattern.exec(textBefore);

    if (!match) {
      continue;
    }

    const applied = rule.handler(state, match);

    if (applied) {
      return applied;
    }
  }

  return null;
}

/** Position and type of the block the cursor sits in. */
function blockAt(state: EditorState): { pos: number; type: NodeType } | null {
  const $from = state.selection.$from;

  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth);

    if (!node.isText) {
      return { pos: $from.before(depth), type: node.type };
    }
  }

  return null;
}

/**
 * Rebuilds the block at `pos` after its marker was typed at the cursor.
 *
 * The marker is deleted first, so `rebuild` only ever sees the content the block
 * keeps. `shift` is the number of tokens the new node puts in front of that content
 * — a list adds two, a blockquote one — which is where the caret ends up.
 *
 * @param state - the state before the marker was typed
 * @param pos - position of the block's own opening token
 * @param markerLength - length of the text that triggered the rule
 * @param rebuild - builds the node that replaces the block
 * @param shift - tokens the replacement adds in front of the block's content
 */
function rebuildBlock(
  state: EditorState,
  pos: number,
  markerLength: number,
  rebuild: (node: Node) => Node,
  shift = 0,
): null | Transaction {
  const from = state.selection.from;
  const start = from - markerLength;
  const tr = state.tr;

  tr.delete(start, from);

  const node = tr.doc.resolve(pos).nodeAfter();

  if (!node) {
    return null;
  }

  tr.replaceWith(pos, pos + node.nodeSize, rebuild(node));

  if (!tr.docChanged) {
    return null;
  }

  tr.setSelection(TextSelection.create(tr.doc, Math.min(start + shift, tr.doc.content.size)));

  return tr;
}

/**
 * Builds the handler of a rule that rebuilds the block around the cursor.
 *
 * @param rebuild - builds the node that takes the block's place
 * @param shift - tokens the replacement puts in front of the block's content
 */
function wrapBlockHandler(rebuild: (node: Node) => Node, shift = 0): InputRule['handler'] {
  return (state, match) => {
    const block = blockAt(state);

    if (!block) {
      return null;
    }

    return rebuildBlock(state, block.pos, match[0].length, rebuild, shift);
  };
}
