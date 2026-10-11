import type { AnyPlugin } from '../extension/extension.ts';
import type { Mark } from '../model/mark.ts';
import type { Node } from '../model/node.ts';
import type { Schema } from '../schema/schema.ts';
import type { Selection } from '../selection/selection.ts';
import type { PluginKey } from './plugin-key.ts';
import type { PluginStateStore } from './plugin-state-store.ts';
import type { Plugin, PluginApplyContext } from './plugin.ts';
import type { Transaction } from './transaction.ts';

import { TextSelection } from '../selection/text-selection.ts';
import { configError, ErrorCode, invariantError } from '../util/errors.ts';
import { PluginKey as PluginKeyClass } from './plugin-key.ts';
import { PluginStateStore as PluginStateStoreClass } from './plugin-state-store.ts';
import { Plugin as PluginClass } from './plugin.ts';
import { Transaction as TransactionClass } from './transaction.ts';

/** Everything `EditorState.create` accepts. */
export interface EditorStateConfig {
  /** Document to start from. Either this or `schema` has to be given. */
  doc?: Node;
  /**
   * Plugins to register. The state type is erased for the same reason an extension erases it: a
   * plugin publishes its state through its key, so a caller handing a `Plugin<HistoryState>` here
   * should not have to widen it by hand.
   */
  plugins?: readonly AnyPlugin[];
  /** Schema used to build an empty document when `doc` is omitted. */
  schema?: Schema;
  /** Initial selection; defaults to the start of the document. */
  selection?: Selection;
  /** Mark to apply to the next typed character. */
  storedMark?: Mark | null;
}

/**
 * How many transactions plugins may append before the state refuses to settle: one appended
 * transaction per round, so a budget rather than a recursion limit. Two plugins appending to each
 * other hit it and produce a diagnosable error instead of an endless loop.
 */
export const MAX_APPENDED_TRANSACTIONS = 100;

/** What applying a transaction produced, including the appends a plugin refused. */
export interface ApplyOutcome {
  /** Names of the plugins whose appended transaction a filter refused, in order. */
  rejectedAppends: readonly string[];
  /** Name of the plugin that refused the root transaction, when one did. */
  rejectedRoot?: string;
  /** The state the transaction and every accepted append produced. */
  state: EditorState;
}

/**
 * The immutable state of an editor: a document, a selection and the state of every plugin, changed
 * only by applying a transaction. Documents are immutable trees with structural sharing, so keeping
 * old states around is cheap. Plugin states live in a {@link PluginStateStore} no caller can reach,
 * so a state read by key is a snapshot.
 *
 * ```ts
 * const state = EditorState.create({ schema, doc });
 * const next = state.apply(state.tr.insert(1, [schema.text('hi')]));
 * ```
 */
export class EditorState {
  /** The document. */
  readonly doc: Node;

  /** Plugins registered in this state, in order. */
  readonly plugins: readonly AnyPlugin[];

  /** Schema the document was built with. */
  readonly schema: Schema;

  /** The selection. */
  readonly selection: Selection;

  /**
   * Plugin state slots; written only while a transaction is applied.
   *
   * @internal
   */
  readonly store: PluginStateStore;

  /**
   * Mark that will be applied to the next typed character: a collapsed cursor cannot carry marks
   * itself, so toggling bold without a selection records the intent here and typing consumes it.
   */
  readonly storedMark: Mark | null;

  /** The transaction that produced this state, when there was one. */
  readonly transaction: null | Transaction;

  /**
   * State of every plugin, in registration order: a copy, so a caller can look at what the plugins
   * remember without being able to write into the state. Reading one plugin's state by its key is
   * the normal way; this is for a debugger, a trace or a test.
   */
  get pluginStates(): readonly unknown[] {
    const values: unknown[] = [];

    for (const plugin of this.plugins) {
      values.push(this.store.getSlot(plugin.id));
    }

    return values;
  }
  /** A transaction based on this state. */
  get tr(): Transaction {
    return new TransactionClass(this);
  }

  /**
   * States are built by `create` and `apply`.
   *
   * @internal
   */
  constructor(
    schema: Schema,
    doc: Node,
    selection: Selection,
    plugins: readonly Plugin[],
    store: PluginStateStore,
    transaction: null | Transaction = null,
    storedMark: Mark | null = null,
  ) {
    this.schema = schema;
    this.doc = doc;
    this.selection = selection;
    this.plugins = plugins;
    this.store = store;
    this.transaction = transaction;
    this.storedMark = storedMark;
  }

  /** Creates a state from a document or a schema. */
  static create(config: EditorStateConfig): EditorState {
    const schema = config.schema ?? config.doc?.type.schema;

    if (!schema) {
      throw configError(
        ErrorCode.EDITOR_STATE_WITHOUT_INPUT,
        'EditorState.create needs either a schema or a doc',
      );
    }

    // A document handed in here is the last place outside data can enter the model, so it is
    // checked against the schema before any plugin state is built on it: a doc from another schema,
    // a node where the content model forbids it or an undeclared attribute is refused instead of
    // becoming the baseline every later edit maps against.
    const doc = config.doc ? schema.assertValid(config.doc) : schema.emptyDoc();
    const plugins = config.plugins ?? [];
    const state = new EditorState(
      schema,
      doc,
      config.selection ?? TextSelection.atStart(doc),
      plugins,
      new PluginStateStoreClass(plugins),
      null,
      config.storedMark ?? null,
    );

    for (const plugin of plugins) {
      if (plugin.hasState) {
        state.store.set(plugin.id, plugin.initState(state));
      }
    }

    return state;
  }

  /**
   * Produces the next state from a transaction: plugin states advance first, then every plugin may
   * append a transaction of its own — normalization, input rules and history restore work that way
   * — and the appends are applied in order.
   */
  apply(transaction: Transaction): EditorState {
    return applyTransaction(this, transaction);
  }

  /** Whether this state and `other` have the same document and selection. */
  eq(other: EditorState | null | undefined): boolean {
    return !!other && this.doc.eq(other.doc) && this.selection.eq(other.selection);
  }

  /** State of the plugin registered under `key`, if any. */
  pluginState<T>(key: PluginKey<T>): T | undefined {
    return this.store.get(key) as T | undefined;
  }

  /** State of the plugin registered under `key`, throwing when it is absent. */
  requirePluginState<T>(key: PluginKey<T>): T {
    const state = this.pluginState(key);

    if (state === undefined) {
      throw invariantError(
        ErrorCode.UNKNOWN_PLUGIN_KEY,
        `Plugin "${key.name}" is not registered in this state`,
        { pluginName: key.name },
      );
    }

    return state;
  }

  toString(): string {
    return `EditorState(${this.doc.name}, ${this.selection.toString()})`;
  }
}

/**
 * Applies a transaction and every transaction a plugin appends in response.
 *
 * Appends are consumed exactly once per plugin: each has a cursor into the transactions that exist
 * so far and is handed only what it has not seen, so a plugin never sees its own input again and
 * one that did nothing is not asked twice.
 *
 * ```text
 * transactions: [T0]              seen: A={0,S0} B={0,S0}
 * round 1: A sees [T0], appends T1 → transactions: [T0, T1], seen: A={2,S2} B={0,S0}
 * round 2: A sees []  , B sees [T0, T1] with oldState S0 and newState S2
 * ```
 *
 * An append goes through the same `filterTransaction` pipeline as the transaction that started the
 * round, so a plugin cannot be bypassed by another plugin's normalization. A vetoed append is
 * dropped rather than retried — the plugin already returned it, so asking again would produce the
 * same rejection forever — and a refusal ends the refused transaction, not the round: the plugins
 * behind it still receive what they have not seen.
 */
export function applyTransactionWithOutcome(
  state: EditorState,
  transaction: Transaction,
): ApplyOutcome {
  assertBasedOn(transaction, state);

  const rejectedRoot = rejectingPlugin(state, transaction);

  if (rejectedRoot) {
    return { rejectedAppends: [], rejectedRoot, state };
  }

  let next = applyOne(state, transaction);

  if (state.plugins.length === 0) {
    return { rejectedAppends: [], state: next };
  }

  const transactions: Transaction[] = [transaction];
  const seenByPlugin = new Map<symbol, { count: number; state: EditorState }>();
  const rejectedAppends: string[] = [];
  // Which plugin produced the last round's transaction, for the budget diagnostic below.
  let origin: null | symbol = null;
  let budget = MAX_APPENDED_TRANSACTIONS;

  while (budget > 0) {
    let appended: null | Transaction = null;

    for (const plugin of state.plugins) {
      if (!plugin.spec.appendTransaction) {
        continue;
      }

      const id = plugin.id;
      const seen = seenByPlugin.get(id) ?? { count: 0, state };

      if (seen.count >= transactions.length) {
        continue;
      }

      const unseen = transactions.slice(seen.count);

      // The cursor advances past everything this plugin was just shown, so it never sees the same
      // transaction twice — not even one it appended itself.
      seenByPlugin.set(id, { count: transactions.length, state: next });
      appended = plugin.spec.appendTransaction(unseen, seen.state, next);

      if (appended) {
        origin = id;
        break;
      }
    }

    if (!appended) {
      return { rejectedAppends, state: next };
    }

    const veto = rejectingPlugin(next, appended);

    if (veto) {
      // Reported rather than silently dropped: a plugin whose every append is refused would look
      // exactly like one that appends nothing.
      rejectedAppends.push(veto);

      // Only this transaction is refused: the scan picks up where it stopped instead of ending,
      // because the plugins behind this one have not been shown the round's transactions yet, and
      // whether they run cannot depend on what an unrelated plugin appended — a content policy
      // refusing one plugin's normalization must not stop the next one from keeping its invariant.
      continue;
    }

    budget -= 1;
    transactions.push(appended);
    next = applyOne(next, appended);
    // The producer has consumed its own transaction; other plugins receive this suffix next turn.
    seenByPlugin.set(origin!, { count: transactions.length, state: next });
  }

  // The budget ran out, which only happens when plugins keep appending in response to each other's
  // output. Naming both ends of the cycle is what makes that diagnosable.
  throw invariantError(
    ErrorCode.PLUGIN_PRODUCED_NO_TRANSACTION,
    `Plugins appended more than ${MAX_APPENDED_TRANSACTIONS} transactions; the editor state cannot settle`,
    {
      appended: transactions.length - 1,
      lastPlugin: pluginNameOf(state.plugins, origin),
      plugins: state.plugins.map((plugin) => plugin.key.name),
    },
  );
}

/**
 * Applies one transaction, mapping the selection through its steps unless it set one explicitly.
 *
 * The new state is built in two phases on purpose: every plugin state is computed first into a
 * store no caller can reach, and a plugin sees the transition through {@link PluginApplyContext}
 * rather than through the state being built. That is what stops a plugin from reading a half built
 * state — the state it is given is the previous one plus a description of what changed.
 */
function applyOne(state: EditorState, transaction: Transaction): EditorState {
  assertBasedOn(transaction, state);

  const doc = transaction.doc;
  const selection = transaction.selectionSet
    ? transaction.selection
    : transaction.selection.map(doc, transaction.mapping, -1);
  const storedMark = transaction.storedMarkSet ? transaction.storedMark : state.storedMark;
  const store = new PluginStateStoreClass(state.plugins);
  const context: PluginApplyContext = {
    changed: transaction.docChanged,
    doc,
    meta: (key: string) => transaction.getMeta(key),
    newSelection: selection,
    oldDoc: state.doc,
    oldSelection: state.selection,
    origin: transaction.origin,
    transaction,
  };

  for (const plugin of state.plugins) {
    // A plugin without state still gets its slot, so a state built by a transaction answers "this
    // plugin is registered" like the one it came from. Slots are addressed by plugin instance, not
    // by key, because two plugins may share a key.
    if (!plugin.hasState) {
      store.set(plugin.id, undefined);
      continue;
    }

    store.set(plugin.id, plugin.spec.state!.apply(context, state.store.getSlot(plugin.id), state));
  }

  return new EditorState(
    state.schema,
    doc,
    selection,
    state.plugins,
    store,
    transaction,
    storedMark,
  );
}

/**
 * The state half of {@link applyTransactionWithOutcome}, for a caller that only wants to move the
 * state forward: what a plugin vetoed on the way is a diagnostic, and `Editor.debug` keeps it.
 */
function applyTransaction(state: EditorState, transaction: Transaction): EditorState {
  return applyTransactionWithOutcome(state, transaction).state;
}

/**
 * Refuses a transaction whose steps were computed from a different document: applying it to a state
 * that holds another document would install text from a version this state never had —
 * realistically through a plugin answering `appendTransaction` with a transaction built from
 * `oldState`, which would silently roll the state back to the document the round started from.
 *
 * The check is on the *document*, not the state object, because a state is also a selection: a drop
 * landing away from the caret is edited from a state that is not the current one while holding the
 * very same document, and those edits are as safe as an edit at the caret. A transaction with no
 * steps obeys the same rule, because `applyOne` reads the document a transaction carries: a
 * selection-only transaction built on an empty document would replace text with nothing. Moving a
 * caret to a foreign position needs `setSelection` on the state's own transaction instead.
 *
 * ```ts
 * const tr = editor.state.tr.setSelection(foreignSelection);
 * ```
 *
 * @throws {InvariantError} when the transaction does not hold the document this state holds
 */
function assertBasedOn(transaction: Transaction, state: EditorState): void {
  if (transaction.state.doc === state.doc) {
    return;
  }

  throw invariantError(
    ErrorCode.STALE_TRANSACTION,
    'A transaction can only be applied to a state holding the document it was built from; rebuild it against the current document instead of applying one computed from an older one',
    { steps: transaction.steps.length, transaction: transaction.toString() },
  );
}

/** Name of the plugin a chain of appended transactions ended with. */
function pluginNameOf(plugins: readonly Plugin[], id: null | symbol): null | string {
  if (id === null) {
    return null;
  }

  return plugins.find((plugin) => plugin.id === id)?.key.name ?? null;
}

/**
 * Name of the plugin that refuses `appended`, or `null` when the transaction passes.
 *
 * The check is a precondition of applying, so it happens before a state is built: a plugin that
 * rejects an edit — a content policy, a read-only mode, an invariant another plugin has to keep —
 * cannot be bypassed by appending instead of dispatching. A plugin that appends a broken
 * transaction answers to the same veto as a command.
 */
function rejectingPlugin(state: EditorState, appended: Transaction): null | string {
  for (const plugin of state.plugins) {
    if (!plugin.accepts(appended, state)) {
      return plugin.key.name;
    }
  }

  return null;
}

/** Re-exported so consumers need a single import for state types. */
export { PluginClass, PluginKeyClass };
