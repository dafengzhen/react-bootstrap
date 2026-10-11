import type { EditorState } from './editor-state.ts';
import type { Transaction } from './transaction.ts';

/**
 * Identifier of a plugin.
 *
 * A key gives a plugin its identity in a reconfigurable state: it carries a stable name and
 * nothing else, so the same kind of plugin can appear in several editors — or twice in one
 * editor — without the instances sharing anything.
 *
 * A key is a **query**, not a claim. It owns no identity slot, no plugin ever writes into it,
 * and a key a module exports for others to read stays valid however many editors are built
 * with it. Which plugin it resolves to is decided by the editor state it is asked about, where
 * each plugin instance owns exactly one slot. That is what keeps two editors independent:
 * building a second editor cannot rebind a key the first one uses, so the first editor's
 * plugin state stays readable and keeps advancing.
 *
 * ```ts
 * const historyKey = new PluginKey<HistoryState>('history');
 * historyKey.getState(state); // the history state of *this* state, or `undefined`
 * ```
 *
 * Registering the same key twice in one editor is a wiring mistake: the state then resolves
 * the key to the first plugin registered under it, and `checkStateInvariants` reports it as
 * `DUPLICATE_PLUGIN_KEY`.
 */
export class PluginKey<PluginState = unknown> {
  /** Debug name, and the identity a state resolves the key with. */
  readonly name: string;

  constructor(name = 'plugin') {
    this.name = name;
  }

  /** The plugin state inside `state`, or `undefined` when the plugin is absent. */
  getState(state: EditorState): PluginState | undefined {
    return state.pluginState(this) as PluginState | undefined;
  }

  /** Convenience accessor used inside transaction hooks. */
  getStateOf(tr: Transaction): PluginState | undefined {
    return this.getState(tr.state);
  }

  toString(): string {
    return `PluginKey(${this.name})`;
  }
}
