import type { EditorState } from '../state/editor-state.ts';
import type { Transaction } from '../state/transaction.ts';
import type { Attrs } from '../util/object.ts';
import type { Command, CommandMap } from './command.ts';

/** How a command reaches the editor that owns it. */
export type CommandDispatch = (transaction: Transaction) => void;

/** What a command factory may be handed; the options bag of a registered command. */
export type CommandFactoryMap = Record<string, (options?: Attrs) => Command>;

/**
 * The one place a command name becomes a running command.
 *
 * A command registry has to answer three questions — what is registered, whether a name could
 * run right now, and what happens when it runs — and the editor answers all three here rather
 * than keeping a second map of its own. The map holds command *factories*, so a name is a
 * function of its options: `run('setHeading', { level: 2 })` builds the command for level 2,
 * and a name nobody registered is `undefined` instead of a silent no-op.
 *
 * ```ts
 * const manager = new CommandManager(factories, (tr) => editor.dispatch(tr));
 *
 * manager.can(state, 'toggleBold');            // asks without running it
 * manager.run(state, 'toggleBold');            // runs it
 * manager.run(state, 'setHeading', { level: 2 });
 * ```
 */
export class CommandManager {
  /** Command factories by name. */
  readonly commands: CommandFactoryMap;

  /** Where a command sends the transaction it builds. */
  readonly dispatch: CommandDispatch;

  constructor(commands: CommandFactoryMap = {}, dispatch: CommandDispatch = () => {}) {
    this.commands = commands;
    this.dispatch = dispatch;
  }

  /** Whether the command named `name` could run against `state`, without running it. */
  can(state: EditorState, name: string, options?: Attrs): boolean {
    const command = this.commands[name];

    return command ? command(options)(state, undefined) : false;
  }

  /** New manager with `extra` merged in; later entries win. */
  extend(extra: CommandFactoryMap): CommandManager {
    return new CommandManager({ ...this.commands, ...extra }, this.dispatch);
  }

  /** Factory registered under `name`, or `undefined`. */
  get(name: string): ((options?: Attrs) => Command) | undefined {
    return this.commands[name];
  }

  /** Names of every registered command, sorted. */
  names(): string[] {
    return Object.keys(this.commands).sort();
  }

  /**
   * Runs the command registered under `name` against `state`.
   *
   * An unknown name reports `false`, the same way a command that declined to run does. A
   * caller that has to tell the two apart uses `Editor.runNamedCommand`, which raises a
   * `CommandError` naming what does exist.
   */
  run(state: EditorState, name: string, options?: Attrs): boolean {
    return this.runNamed(state, name, options);
  }

  /**
   * Runs a command against `state`, dispatching what it builds.
   *
   * @param dispatch - where the transaction goes; defaults to the manager's own dispatch
   */
  runCommand(
    state: EditorState,
    command: Command,
    dispatch: CommandDispatch = this.dispatch,
  ): boolean {
    return command(state, dispatch);
  }

  /**
   * Runs the named commands in order against `state`, stopping at the first success.
   *
   * This is what a keymap with a fallback needs: `Mod-Enter` can try "insert a hard break" and
   * then "split the block" without the caller knowing how many commands that is.
   */
  runFirst(state: EditorState, names: readonly string[]): boolean {
    for (const name of names) {
      if (this.run(state, name)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Runs a command against `state`, marking what it dispatches as coming from a command.
   *
   * The origin is set here rather than in every command, because this is the boundary that knows
   * a command is running and which one it is: `traceTransactions` then reads `command:toggleBold`
   * instead of `user`, and a plugin can tell a command apart from something the browser did. A
   * command that already set an origin keeps it — undo marks its restore `"history"`, a more
   * specific answer than "a command ran".
   *
   * @param name - name the command was registered under, for diagnostics
   */
  runNamed(state: EditorState, name: string, options?: Attrs): boolean {
    const factory = this.commands[name];

    if (!factory) {
      return false;
    }

    return this.runCommand(state, factory(options), (tr) => {
      this.dispatch(tr.setOriginIfUnset({ command: name, kind: 'command' }));
    });
  }
}

/** Builds a command map, keeping the literal key types for typed access. */
export function defineCommands<Commands extends CommandMap>(commands: Commands): Commands {
  return commands;
}
