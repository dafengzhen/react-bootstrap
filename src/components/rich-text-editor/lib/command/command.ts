import type { EditorState } from '../state/editor-state.ts';
import type { Transaction } from '../state/transaction.ts';

/**
 * An editor command.
 *
 * A command is a pure function of the state. Called without `dispatch` it only
 * reports whether it *could* run, which is what powers `editor.can().toggleBold()`
 * and disabled toolbar buttons; called with `dispatch` it builds a transaction and
 * hands it over.
 *
 * ```ts
 * const toggleBold: Command = (state, dispatch) => {
 *   const mark = state.schema.marks.bold;
 *   const tr = state.tr.addMark(state.selection.from, state.selection.to, mark.create());
 *   dispatch?.(tr);
 *   return true;
 * };
 * ```
 */
export type Command = (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean;

/** A map of named commands. */
export type CommandMap = Record<string, Command>;

/** Runs the first command that succeeds, which is how keymaps chain fallbacks. */
export function chainCommands(...commands: readonly Command[]): Command {
  return (state, dispatch) => {
    for (const command of commands) {
      if (command(state, dispatch)) {
        return true;
      }
    }

    return false;
  };
}

/**
 * Runs a command only when `predicate` holds.
 *
 * `can().toggleBold()` on a read-only editor or a node selection has to report
 * `false`, and this is how that is expressed.
 */
export function commandGuard(
  command: Command,
  predicate: (state: EditorState) => boolean,
): Command {
  return (state, dispatch) => predicate(state) && command(state, dispatch);
}

/**
 * Turns a command that always applies into one that reports whether it changed anything.
 *
 * "Changed" is read from the transaction the command dispatched, not from its return value, and
 * it covers everything a transaction can change: the document, the selection and the stored mark
 * a collapsed cursor carries. A command that only sets the stored mark — what `toggleBold` does
 * with nothing selected — still changes what the editor does next, so reporting `false` for it
 * would tell the caller its command did nothing at all.
 */
export function commandWithDispatch(command: Command): Command {
  return (state, dispatch) => {
    if (!dispatch) {
      return command(state, undefined);
    }

    let changed = false;
    const wrapped = (tr: Transaction): void => {
      if (tr.changed || tr.storedMarkSet) {
        changed = true;
      }

      dispatch(tr);
    };

    return command(state, wrapped) && changed;
  };
}
