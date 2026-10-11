import type { PluginKey } from './plugin-key.ts';
import type { Plugin } from './plugin.ts';

/**
 * The plugin half of an editor state.
 *
 * A plugin state slot is a value a plugin stores in every `EditorState`, and this store is the
 * only thing that holds them. It exists because an old state keeps describing the moment it was
 * created, so nothing may write into it afterwards: a `Map` handed out as a public field breaks
 * that promise — `readonly` stops a caller from replacing the field, not from calling `set` on
 * the map inside it — and history, state comparison and any future collaboration layer would be
 * reading a snapshot somebody else can still change.
 *
 * So the map stays private. A caller reads a plugin state through its key, which is the name
 * that plugin published, and writes one only by applying a transaction.
 *
 * The slot identity is the **plugin instance**, not the key: two plugins sharing a key keep
 * separate slots, because each instance owns its own symbol. The store remembers which plugin a
 * key resolves to when it is built, so a key never has to be bound to a plugin and a module
 * level key can safely be reused by any number of editors.
 *
 * Reading goes through the key, because a reader only has the key; writing goes through the
 * plugin instance, because a key registered twice describes two slots and a write has to name
 * the one it means.
 *
 * ```ts
 * const store = new PluginStateStore(plugins);
 *
 * store.set(plugin.id, value);            // while a transaction is applied
 * store.get(store.idOf(plugin.key)!);     // while a plugin is asked for its state
 * ```
 *
 * Built by `EditorState`; a host never creates one.
 *
 * @internal
 */
export class PluginStateStore {
  /** Number of plugin slots, including the ones that are still empty. */
  get size(): number {
    return this.slots.size;
  }

  /** Plugin ids that share a key with an earlier plugin, for diagnostics. */
  private readonly duplicateKeys = new Set<symbol>();

  /** Slots by plugin id; private, so no caller can reach a state without its key. */
  private readonly slots = new Map<symbol, unknown>();

  /** Plugin id per key, built once; a key registered twice resolves to the first plugin. */
  private readonly slotsByKey = new Map<PluginKey, symbol>();

  constructor(plugins: readonly Plugin[] = []) {
    for (const plugin of plugins) {
      // Every registered plugin gets its slot up front, so a plugin that is asked for its
      // state before the first transaction sees `undefined` rather than a missing entry.
      this.slots.set(plugin.id, undefined);

      const existing = this.slotsByKey.get(plugin.key);

      if (existing === undefined) {
        this.slotsByKey.set(plugin.key, plugin.id);
      } else if (existing !== plugin.id) {
        this.duplicateKeys.add(plugin.id);
      }
    }
  }

  /** Value stored in the slot of the plugin registered under `key`, or `undefined`. */
  get(key: PluginKey): unknown {
    const id = this.idOf(key);

    return id === undefined ? undefined : this.slots.get(id);
  }

  /**
   * Value stored in the slot of one plugin instance.
   *
   * A caller that holds the plugin reads the slot directly, because a key registered twice
   * cannot name one of the two slots.
   */
  getSlot(id: symbol): unknown {
    return this.slots.get(id);
  }

  /** Whether a key resolves to a plugin of this state. */
  has(key: PluginKey): boolean {
    return this.slotsByKey.has(key);
  }

  /** Whether a plugin of this state had to share its key with an earlier one. */
  hasDuplicateKey(plugin: Plugin): boolean {
    return this.duplicateKeys.has(plugin.id);
  }

  /** Id of the plugin a key resolves to in this state, if any. */
  idOf(key: PluginKey): symbol | undefined {
    return this.slotsByKey.get(key);
  }

  /** Ids of every registered plugin, in registration order. */
  ids(): symbol[] {
    return [...this.slots.keys()];
  }

  /**
   * Writes the slot of one plugin instance.
   *
   * Only a transaction application calls this: a plugin state moves from the value the old
   * state held to the value the new state holds, and both belong to the same editor. The write
   * names the plugin rather than its key, because two plugins may share a key and only one of
   * the two slots is meant.
   */
  set(id: symbol, value: unknown): void {
    this.slots.set(id, value);
  }
}
