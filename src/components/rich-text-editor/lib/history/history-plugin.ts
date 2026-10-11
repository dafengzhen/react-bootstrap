import type { Selection } from '../selection/selection.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { Transaction } from '../state/transaction.ts';
import type { StepMap } from '../transform/step-map.ts';
import type { Step } from '../transform/step.ts';

import { PluginKey } from '../state/plugin-key.ts';
import { Plugin } from '../state/plugin.ts';
import { configError, ErrorCode } from '../util/errors.ts';

/** Metadata key a command sets to request an undo. */
export const UNDO_META = 'historyUndo';

/** Metadata key a command sets to request a redo. */
export const REDO_META = 'historyRedo';

/** Metadata key a transaction carries while a history restore is applied. */
export const RESTORE_META = 'historyRestore';

/** Metadata key naming the group a transaction belongs to, e.g. `typing`. */
export const GROUP_META = 'historyGroup';

/** One undoable edit. */
export interface HistoryItem {
  /** Group the edit belongs to; same-group edits merge. */
  group: null | string;
  /** Steps in reverse order, ready to be undone. */
  readonly inverted: readonly Step[];
  /** Selection after the steps were applied. */
  readonly selectionAfter: Selection;
  /** Selection before the steps were applied. */
  readonly selectionBefore: Selection;
  /** Steps in applied order, ready to be redone. */
  readonly steps: readonly Step[];
  /** Sequence number used for grouping and the time window. */
  time: number;
}

/** Options of the history plugin. */
export interface HistoryOptions {
  /**
   * How many edits to remember. Defaults to `100`; `0` and `null` switch the history off, because
   * `slice(-0)` is `slice(0)`, which would otherwise mean "remember everything".
   */
  depth?: null | number;
  /**
   * How long two edits of the same group may be apart before they stop merging, in ms.
   * Defaults to `500`.
   */
  groupDelay?: number;
  /** Clock used for grouping; injectable so tests need not wait. */
  now?: () => number;
}

/** Largest history a caller may ask for, so a typo cannot reserve an unbounded list. */
export const MAX_HISTORY_DEPTH = 10_000;

/** Persistent history of one editor. */
export interface HistoryState {
  /** Edits that can be undone, oldest first. */
  done: HistoryItem[];
  /** Edits that can be redone, most recently undone last. */
  undone: HistoryItem[];
}

/** Key under which the history state lives. */
export const historyKey = new PluginKey<HistoryState>('history');

/** Whether there is an edit to redo. */
export function canRedo(state: EditorState): boolean {
  return (historyKey.getState(state)?.undone.length ?? 0) > 0;
}

/** Whether there is an edit to undo. */
export function canUndo(state: EditorState): boolean {
  return (historyKey.getState(state)?.done.length ?? 0) > 0;
}

/**
 * History plugin: undo and redo built on step inversion.
 *
 * An item holds the steps of a document-changing transaction and their inverses, so undo applies
 * them in reverse order — no snapshots, no diffing. Edits in the same group (`typing`, `delete`,
 * `mark`) merge within the group delay, so a run of typing undoes at once.
 */
export function history(options: HistoryOptions = {}): Plugin<HistoryState> {
  const depth = validateDepth(options.depth);
  const groupDelay = validateGroupDelay(options.groupDelay);
  const now = options.now ?? (() => Date.now());

  return new Plugin<HistoryState>({
    appendTransaction: (transactions, _oldState, newState) => {
      // A restore must not trigger the next restore: the transaction it produces is shown to
      // plugins again. The same guard stops undo and redo firing together — both flags in one
      // transaction is a wiring mistake, and undo wins.
      const restoring = transactions.some((tr) => tr.getMeta(RESTORE_META));
      const wantsUndo = !restoring && transactions.some((tr) => tr.getMeta(UNDO_META));
      const wantsRedo =
        !restoring && !wantsUndo && transactions.some((tr) => tr.getMeta(REDO_META));

      if (!wantsUndo && !wantsRedo) {
        return null;
      }

      const state = historyKey.getState(newState);

      if (!state) {
        return null;
      }

      const item = wantsUndo
        ? state.done[state.done.length - 1]
        : state.undone[state.undone.length - 1];

      if (!item) {
        return null;
      }

      const tr = wantsUndo ? undoTransaction(newState, item) : redoTransaction(newState, item);

      if (!tr) {
        return null;
      }

      // The item moves to the other stack, and the restore transaction must not be recorded as a
      // fresh user edit. Plugin states are immutable, so the move replaces the stacks.
      const next: HistoryState = wantsUndo
        ? { done: state.done.slice(0, -1), undone: [...state.undone, item] }
        : { done: [...state.done, item], undone: state.undone.slice(0, -1) };

      tr.setMeta(RESTORE_META, next);
      tr.setOrigin({ command: wantsUndo ? 'undo' : 'redo', kind: 'history' });

      return tr;
    },
    key: historyKey,
    state: {
      apply: (context, value) => {
        if (!value) {
          return { done: [], undone: [] };
        }

        const restored = context.meta(RESTORE_META) as HistoryState | undefined;

        if (restored) {
          return restored;
        }

        if (!context.changed) {
          return value;
        }

        const inverted = invertTransaction(context.transaction);

        if (!inverted) {
          return value;
        }

        const group = (context.meta(GROUP_META) as string | undefined) ?? null;
        const time = now();
        const last = value.done[value.done.length - 1];
        const item: HistoryItem = {
          group,
          inverted: inverted.inverted,
          selectionAfter: context.newSelection,
          selectionBefore: inverted.selectionBefore,
          steps: [...context.transaction.steps],
          time,
        };

        if (depth === 0) {
          return value;
        }

        if (last && group !== null && last.group === group && time - last.time <= groupDelay) {
          return { done: [...value.done.slice(0, -1), mergeItems(last, item)], undone: [] };
        }

        return { done: [...value.done, item].slice(-depth), undone: [] };
      },
      init: () => ({ done: [], undone: [] }),
    },
  });
}

/** Marks a transaction as belonging to `group`, so consecutive edits merge. */
export function setHistoryGroup(tr: Transaction, group: string): Transaction {
  return tr.setMeta(GROUP_META, group);
}

/** Inverts the steps of a transaction against the document it was applied to. */
function invertTransaction(
  tr: Transaction,
): { inverted: Step[]; selectionBefore: Selection } | null {
  const inverted: Step[] = [];

  for (let index = tr.steps.length - 1; index >= 0; index--) {
    const step = tr.steps[index]!;
    const doc = tr.documentsBefore[index];

    if (!doc) {
      return null;
    }

    inverted.push(step.invert(doc));
  }

  return { inverted, selectionBefore: tr.state.selection };
}

/** Combines two items of the same group. */
function mergeItems(first: HistoryItem, second: HistoryItem): HistoryItem {
  return {
    group: second.group,
    inverted: [...second.inverted, ...first.inverted],
    selectionAfter: second.selectionAfter,
    selectionBefore: first.selectionBefore,
    steps: [...first.steps, ...second.steps],
    time: second.time,
  };
}

/** Builds the transaction that redoes `item`. */
function redoTransaction(state: EditorState, item: HistoryItem): null | Transaction {
  const tr = state.tr;

  for (const step of item.steps) {
    if (!tr.step(step)) {
      return null;
    }
  }

  tr.setSelection(item.selectionAfter.map(tr.doc, tr.mapping, -1));

  return tr;
}

/** Builds the transaction that undoes `item`. */
function undoTransaction(state: EditorState, item: HistoryItem): null | Transaction {
  const tr = state.tr;

  for (const step of item.inverted) {
    if (!tr.step(step)) {
      return null;
    }
  }

  tr.setSelection(item.selectionBefore.map(tr.doc, tr.mapping, -1));

  return tr;
}

/**
 * Validated history depth, where `0` and `null` mean "no history": a depth that is not a
 * non-negative whole number is a configuration mistake, since `slice(-2.5)` and `slice(-0)` both
 * behave in a way nobody intends.
 */
function validateDepth(depth: HistoryOptions['depth']): number {
  if (depth === undefined) {
    return 100;
  }

  if (depth === null || depth === 0) {
    return 0;
  }

  if (!Number.isInteger(depth) || depth < 0 || depth > MAX_HISTORY_DEPTH) {
    throw configError(
      ErrorCode.INVALID_OPTION,
      `history depth has to be a whole number between 0 and ${MAX_HISTORY_DEPTH}, or null to switch the history off`,
      { depth, max: MAX_HISTORY_DEPTH, option: 'depth' },
    );
  }

  return depth;
}

/** Validated grouping delay in milliseconds. */
function validateGroupDelay(delay: HistoryOptions['groupDelay']): number {
  if (delay === undefined) {
    return 500;
  }

  if (!Number.isFinite(delay) || delay < 0) {
    throw configError(
      ErrorCode.INVALID_OPTION,
      'history groupDelay has to be a finite number of milliseconds that is not negative',
      { groupDelay: delay, option: 'groupDelay' },
    );
  }

  return delay;
}

/** Re-exported for plugins that need to look at a step map. */
export type { StepMap };
