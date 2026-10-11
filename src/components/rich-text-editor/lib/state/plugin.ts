import type { Node } from '../model/node.ts';
import type { Selection } from '../selection/selection.ts';
import type { EditorState } from './editor-state.ts';
import type { PluginKey } from './plugin-key.ts';
import type { Transaction } from './transaction.ts';

import { PluginKey as PluginKeyClass } from './plugin-key.ts';

/** Props a plugin can contribute to the editor. */
export interface EditorProps {
  /** Handles a keyboard event; answering `true` means the event was consumed. */
  handleKeyDown?: (event: KeyEventLike, state: EditorState) => boolean;
}

/**
 * The parts of a keyboard event the core needs: the core never touches the DOM, so a view
 * adapter passes an object with these fields instead of the browser's `KeyboardEvent`.
 */
export interface KeyEventLike {
  /** Whether alt was held. */
  altKey?: boolean;
  /** Whether ctrl was held. */
  ctrlKey?: boolean;
  /** Key that was pressed, e.g. `b` or `Enter`. */
  key?: string;
  /** Whether meta (command) was held. */
  metaKey?: boolean;
  /** Called by the handler that consumed the event. */
  preventDefault?: () => void;
  /** Whether shift was held. */
  shiftKey?: boolean;
}

/** Declaration of a plugin. */
export interface PluginSpec<PluginState = unknown> {
  /**
   * Extra transactions to apply after the given ones, called with every transaction a state
   * application produced: how normalization, input rules and history restore react to an edit.
   */
  appendTransaction?: (
    transactions: readonly Transaction[],
    oldState: EditorState,
    newState: EditorState,
  ) => null | Transaction;

  /** Rejects a transaction before it is applied. */
  filterTransaction?: (tr: Transaction, state: EditorState) => boolean;

  /** Key that identifies this plugin inside a state. */
  key?: PluginKey<PluginState>;

  /** Extra behaviour contributed to the editor. */
  props?: EditorProps;

  /** Persistent state owned by the plugin. */
  state?: PluginStateSpec<PluginState>;
}

/**
 * What kind of change produced a transaction: the closed set `origin.kind` is read against.
 */
export type TransactionKind =
  /** A keyboard shortcut or a command run by name. */
  | 'command'
  /** An edit from an IME composition. */
  | 'composition'
  /** An undo or a redo. */
  | 'history'
  /** A character typed, or an edit the browser made and the view read back. */
  | 'input'
  /** A transaction a plugin appended to fix another one. */
  | 'normalization'
  /** A paste, a drop or another clipboard transfer. */
  | 'paste'
  /** A change from another editor or process. */
  | 'remote'
  /** The editor itself, while being built or torn down. */
  | 'system'
  /** Something the user did that fits no kind above. */
  | 'user';

/**
 * Where a transaction came from.
 *
 * A plugin that must tell a user edit from a programmatic one — history above all, which must not
 * record a normalization pass as an edit to undo — reads this rather than metadata keys, which
 * cover only the values one transaction carries.
 *
 * ```ts
 * context.origin.kind === 'remote' ? value : record(value)
 * ```
 */
export interface TransactionOrigin {
  /** Command that produced the transaction, when known. */
  command?: string;
  kind: TransactionKind;
  /** Plugin that appended the transaction, when one did. */
  plugin?: string;
}

/** Default origin: something the user did. */
export const USER_ORIGIN: TransactionOrigin = { kind: 'user' };

/** What a plugin state sees while one transaction is applied. */
export interface PluginApplyContext {
  /** Whether the document changed; `false` when only the selection moved. */
  changed: boolean;
  /** The document after the transaction. */
  doc: Node;
  /** Metadata attached to the transaction. */
  meta: (key: string) => unknown;
  /** The selection after the transaction. */
  newSelection: Selection;
  /** The document before the transaction. */
  oldDoc: Node;
  /** The selection before the transaction. */
  oldSelection: Selection;
  origin: TransactionOrigin;
  /** The transaction itself, for its steps and metadata. */
  transaction: Transaction;
}

/** What a plugin state needs to implement. */
export interface PluginStateSpec<PluginState> {
  /**
   * Produces the next plugin state from a transaction, once per applied transaction.
   *
   * The previous state and a description of the change are passed, never the state being built:
   * a plugin can neither read a slot another plugin has not filled nor write into a state that
   * was already handed out. Reading another plugin's state belongs in `appendTransaction`,
   * where that state is complete.
   */
  apply: (context: PluginApplyContext, value: PluginState, state: EditorState) => PluginState;

  /** Builds the initial state from the editor state the plugin is registered in. */
  init: (config: { state: EditorState }) => PluginState;
}

/**
 * A plugin adds cross cutting behaviour to the editor: persistent state (history, decorations),
 * vetoing transactions, and appending its own — the mechanism normalization, input rules and
 * history restore build on.
 */
export class Plugin<PluginState = unknown> {
  /**
   * Identity of this plugin *instance*, which owns its state slot. Never written into the key: a
   * key is a query any number of editors share, so claiming one would rebind it for every other
   * editor built from the same declaration.
   */
  readonly id: symbol = Symbol('plugin');

  /** Key this plugin is registered under. */
  readonly key: PluginKey<PluginState>;

  readonly spec: PluginSpec<PluginState>;

  get hasState(): boolean {
    return !!this.spec.state;
  }

  constructor(spec: PluginSpec<PluginState>) {
    this.spec = spec;
    this.key = spec.key ?? new PluginKeyClass<PluginState>();
  }

  /** Whether the plugin wants to reject `tr`. */
  accepts(tr: Transaction, state: EditorState): boolean {
    return this.spec.filterTransaction ? this.spec.filterTransaction(tr, state) : true;
  }

  /** Initial state of this plugin inside `state`; `undefined` when it carries none. */
  initState(state: EditorState): PluginState | undefined {
    return this.spec.state?.init({ state });
  }

  toString(): string {
    return `Plugin(${this.key.name})`;
  }
}

/** Builds a plugin from a spec. */
export function createPlugin<PluginState = unknown>(
  spec: PluginSpec<PluginState>,
): Plugin<PluginState> {
  return new Plugin(spec);
}

/** Whether a transaction came from a user action rather than from the editor itself. */
export function isUserOrigin(origin: TransactionOrigin): boolean {
  return (
    origin.kind === 'command' ||
    origin.kind === 'composition' ||
    origin.kind === 'input' ||
    origin.kind === 'paste' ||
    origin.kind === 'user'
  );
}
