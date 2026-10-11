import type { Command } from './command/command.ts';
import type { Extension, ExtensionManager, Keymap } from './extension/extension.ts';
import type { Fragment } from './model/fragment.ts';
import type { Mark } from './model/mark.ts';
import type { Node as DocNode } from './model/node.ts';
import type { NodeJSON } from './model/node.ts';
import type { Schema } from './schema/schema.ts';
import type { Selection } from './selection/selection.ts';
import type { FileUploader } from './serialization/types.ts';
import type { EditorState } from './state/editor-state.ts';
import type { KeyEventLike } from './state/plugin.ts';
import type { Plugin, TransactionOrigin } from './state/plugin.ts';
import type { Transaction } from './state/transaction.ts';
import type { StepJSON } from './transform/step.ts';
import type { Attrs } from './util/object.ts';
import type { EditorLocale } from './view/locale.ts';

/**
 * Wiring the position module is what makes `doc.resolve(pos)` work, so it is imported here rather
 * than through the public entry point.
 */
import './position/position.ts';
import { CommandManager } from './command/command-manager.ts';
import { keyName } from './command/key-name.ts';
import { forEachTextNode, markActive } from './command/mark-commands.ts';
import { abortUploadsFor, updateUploadAnchors } from './command/media-commands.ts';
import { createExtensionContext } from './extension/extension.ts';
import { ExtensionManager as ExtensionManagerClass } from './extension/extension.ts';
import { Schema as SchemaClass } from './schema/schema.ts';
import { TextSelection } from './selection/text-selection.ts';
import { serializeDocument } from './serialization/html-serializer.ts';
import { serializeMarkdown } from './serialization/markdown.ts';
import { toPlainText } from './serialization/plain-text.ts';
import {
  applyTransactionWithOutcome,
  EditorState as EditorStateClass,
} from './state/editor-state.ts';
import { checkStateInvariants } from './state/invariants.ts';
import { commandError, ErrorCode, invariantError } from './util/errors.ts';

/** Names of every editor event. */
export type EditorEvent = keyof EditorEvents;

/** Callback of one event. */
export type EditorEventHandler<T extends EditorEvent> = (payload: EditorEvents[T]) => void;

/** Payload of `update`, with common fields unwrapped. */
export interface EditorEventMap {
  [key: string]: unknown;
}

/** Events an editor emits. */
export interface EditorEvents {
  beforeTransaction: { state: EditorState; transaction: Transaction };
  create: { editor: Editor };
  destroy: { editor: Editor };
  selectionUpdate: { editor: Editor; state: EditorState; transaction: null | Transaction };
  transaction: { editor: Editor; state: EditorState; transaction: Transaction };
  update: { editor: Editor; state: EditorState; transaction: Transaction };
}

/** Options of `new Editor(...)`. */
export interface EditorOptions {
  autofocus?: boolean;
  content?: NodeJSON;
  /** Whether the editor accepts edits. Defaults to `true`. */
  editable?: boolean;
  /** Element to mount a view into, or a selector; omit for headless use. */
  element?: unknown;
  extensions?: readonly Extension[];
  history?: { depth?: number; groupDelay?: number };
  /**
   * Copy the editor writes into the DOM: the accessible name, the placeholder, ...
   *
   * Every string the kernel puts on screen is a named slot here. See `src/view/locale.ts`.
   */
  locale?: EditorLocale;
  /**
   * Shape of the document the schema describes: `topNode` names the root node type — `"doc"` unless
   * an extension declares another one — and `initialBlock` names the block an empty document starts
   * with. Both default from the schema; naming the initial block keeps a blank document stable
   * across releases when a schema has several textblocks.
   */
  schema?: { initialBlock?: string; topNode?: string };
  selection?: Selection;
  /** Upload adapters; the core never talks to a storage provider. */
  upload?: { file?: FileUploader; image?: FileUploader };
  /**
   * Whether every applied transaction is checked against the state invariants. The check walks the
   * document and every plugin slot, so it is off by default — free in a test, far too expensive per
   * keystroke in production — and a development build that turns it on finds a broken invariant
   * where it was caused instead of where it surfaced.
   *
   * ```ts
   * new Editor({ extensions: [StarterKit], validate: import.meta.env.DEV });
   * ```
   *
   * @throws {InvariantError} when a transaction leaves the state inconsistent
   */
  validate?: boolean;
}

/**
 * A DOM view attached to an editor. The core never creates one: the view entry point registers
 * a factory and the editor talks to views through this interface, which keeps `src/core.ts` free of
 * the DOM (design §77: the view depends on the core, never the other way round).
 */
export interface EditorViewLike {
  blur: () => void;
  /**
   * Drops a selection write the view is still holding for an older document; optional, since a view
   * that never defers a write has nothing to cancel.
   */
  cancelPendingSelection?: () => void;
  /** Destroys the view and detaches its listeners. */
  destroy: () => void;
  /** Editable root element the view owns. */
  readonly dom: unknown;
  focus: () => void;
  setEditable: (editable: boolean) => void;
  /** Re-renders after a state change. */
  update: (state: EditorState, transaction?: Transaction) => void;
}

/** The DOM half, registered by the view entry point. */
export interface ViewModule {
  /** Builds the view of an editor. */
  createView: (
    editor: Editor,
    element: unknown,
    options: { locale?: EditorLocale },
  ) => EditorViewLike;
  /** Parses HTML into document content, for `setHTML`. */
  parseHTML: (html: string, schema: Schema) => Fragment;
}

let viewModule: null | ViewModule = null;

/**
 * The editor: the public API, owning the schema, the plugin list, the current state and the command
 * registry. It works headless — no DOM, no framework — so the same core runs in Node, in an SSR
 * pass and in a unit test.
 *
 * ```ts
 * const editor = new Editor({ content: docJson, extensions: [StarterKit] });
 * editor.commands.toggleBold();
 * ```
 */
export class Editor {
  readonly commands: Record<string, (options?: Attrs) => boolean>;

  readonly extensions: ExtensionManager;

  readonly historyOptions: EditorOptions['history'];

  readonly schema: Schema;

  /**
   * Keyboard shortcuts of every extension, as `Mod-b` style strings. The core never listens for key
   * events itself: a view passes what it observed to {@link Editor.runKey}.
   */
  readonly shortcutMap: Keymap;

  state: EditorState;

  /** Upload adapters, for extensions to use. */
  readonly upload: EditorOptions['upload'];

  /** Whether the editor accepts edits. */
  get isEditable(): boolean {
    return this.editable;
  }

  /** The DOM view attached to this editor, if any. */
  get view(): EditorViewLike | null {
    return this.viewInstance;
  }

  /**
   * Every view rendering this editor. `element` attaches the first one for you, but the
   * programmatic API builds a view from a module the core does not import:
   *
   * ```ts
   * const view = createEditorView(editor, { element: '#editor' });
   * ```
   *
   * More than one view of the same state is legal, and a view built this way registers itself here.
   */
  get views(): readonly EditorViewLike[] {
    return [...this.attachedViews];
  }

  /** Views that render this editor, in registration order. */
  private readonly attachedViews = new Set<EditorViewLike>();

  private readonly commandManager: CommandManager;

  /**
   * Name a command object was registered under: a keymap holds command objects and an entry does
   * not carry its name, so this is the reverse lookup that lets {@link Editor.runKey} report which
   * command a key ran.
   */
  private readonly commandNames = new WeakMap<Command, string>();

  /** Whether the editor accepts edits. */
  private editable: boolean;

  private readonly listeners = new Map<string, Set<(payload: never) => void>>();

  private readonly options: EditorOptions;

  /** Plugins whose appended transaction a filter refused; see `debug()`. */
  private readonly rejectedAppends: string[] = [];
  /** How many transactions this editor applied; trace entries count by it. */
  private traceCounter = 0;
  /** Last transactions applied, oldest first; see `traceTransactions`. */
  private readonly traces: TransactionTrace[] = [];
  private viewInstance: EditorViewLike | null = null;

  constructor(options: EditorOptions = {}) {
    this.editable = options.editable ?? true;
    this.historyOptions = options.history;
    this.options = options;
    this.upload = options.upload;
    this.extensions = new ExtensionManagerClass(options.extensions ?? []);

    const context = createExtensionContext(this);

    this.extensions.bind(context);

    // Reading the extensions happens in two ordered steps, because their hooks need the schema and
    // the schema needs their node and mark specs: first the specs, plus which extension contributed
    // each one (cached by the manager, so the registry below reuses these exact specs), then the
    // schema, then everything else — commands, shortcuts, plugins, input rules — compiled once into
    // a registry that no longer calls a hook.
    const { markSpecs, nodeOwners, nodeSpecs } = this.extensions.schemaSpecs();

    if (!nodeSpecs.text) {
      nodeSpecs.text = { group: 'inline', name: 'text' };
    }

    const topNodeName = options.schema?.topNode ?? 'doc';

    // The extension declaring the schema's root node says what a blank document looks like:
    // `StarterKit` declares `doc` and asks for a paragraph, a host can ask for another block
    // through `options.schema`.
    const rootOwner = this.extensions.get(nodeOwners[topNodeName] ?? '');

    this.schema = new SchemaClass({
      initialBlock: options.schema?.initialBlock ?? (rootOwner?.options?.initialBlock as string),
      marks: markSpecs,
      nodes: nodeSpecs,
      topNode: topNodeName,
    });

    // The schema exists, so the hooks that see it can run; everything below reads their result.
    context.schema = this.schema;

    const { commands: commandFactories, keymap, plugins } = this.extensions.compiled();

    const doc = options.content ? this.schema.nodeFromJSON(options.content) : undefined;

    this.state = EditorStateClass.create({
      doc,
      plugins,
      schema: this.schema,
      selection: options.selection,
    });

    this.commandManager = new CommandManager(commandFactories, (tr) => this.dispatch(tr));
    this.shortcutMap = keymap;
    this.commands = this.buildCommands();

    if (options.element) {
      this.attachView(options.element);
    }

    this.emit('create', { editor: this });
  }

  /**
   * The mark of `name` at the selection, if any.
   *
   * The selection is read the way `isActive()` reads it, because the two answer the same question:
   * at a cursor, the stored mark first and then the character the caret sits next to; in a range,
   * the marks of the text *inside* it. Reading the whole paragraph instead reports a link elsewhere
   * in the block as the link at the caret, which is a toolbar highlighting a button nobody
   * selected. A range carrying several marks of one type has no single answer: the first in
   * document order is reported, which is the one {@link Editor.isActive} finds.
   */
  activeMark(name: string): Mark | null {
    const type = this.schema.marks[name];

    if (!type) {
      return null;
    }

    const { empty, from, to } = this.state.selection;

    if (empty) {
      const stored = this.state.storedMark;

      if (stored?.type === type) {
        return stored;
      }

      // Only the character before the caret: the caret after a link is outside it, while the caret
      // before one belongs to the link.
      const before = this.state.doc.resolve(from).nodeBefore();

      return before?.markSet.find((mark) => mark.type === type) ?? null;
    }

    let found: Mark | null = null;

    forEachTextNode(this.state.doc, from, to, (node) => {
      if (found) {
        return;
      }

      found = node.markSet.find((mark) => mark.type === type) ?? null;
    });

    return found;
  }

  /**
   * Registers a view built outside the editor, so the editor renders into it. A view created from
   * the view entry point calls this itself; calling it twice with the same view changes nothing.
   */
  attach(view: EditorViewLike): void {
    this.attachedViews.add(view);
  }

  /**
   * Attaches a DOM view and renders the current document into it. The view lives in its own entry
   * point, so the core does not import it, and this raises a clear error when it was never loaded.
   */
  attachView(element: unknown): EditorViewLike {
    if (!viewModule) {
      throw invariantError(
        ErrorCode.VIEW_MODULE_MISSING,
        'No view module is registered: import the editor together with its view entry point before passing `element`',
      );
    }

    this.detachView();

    const locale = this.options.locale;

    const view = viewModule.createView(this, element, locale === undefined ? {} : { locale });

    this.viewInstance = view;
    this.attachedViews.add(view);
    view.setEditable(this.editable);

    if (this.options.autofocus) {
      view.focus();
    }

    return view;
  }

  /** Collapses the selection to its start and drops the focus. */
  blur(): void {
    if (this.viewInstance) {
      this.viewInstance.blur();
    }

    const { from } = this.state.selection;

    this.dispatch(this.state.tr.setSelection(TextSelection.at(this.state.doc, from)));
  }

  /**
   * Query API mirroring `commands`, but without side effects.
   *
   * A read-only editor answers `false` for every command, because {@link Editor.dispatch} would
   * refuse the change — a toolbar asking only the command would show an enabled button that does
   * nothing. A selection-only command is refused too, since the query cannot tell the two apart.
   */
  can(): Record<string, (options?: Attrs) => boolean> {
    const proxy: Record<string, (options?: Attrs) => boolean> = {};

    for (const name of this.commandManager.names()) {
      proxy[name] = (options?: Attrs): boolean =>
        this.editable && this.commandManager.can(this.state, name, options);
    }

    return proxy;
  }

  /**
   * Whether a command could run, without running it. A read-only editor reports `false`, for the
   * same reason {@link Editor.can} does.
   */
  canRunCommand(command: Command): boolean {
    return this.editable && command(this.state, undefined);
  }

  /**
   * Dumps the current state, for debugging: the extensions that were overridden — a command that
   * silently does nothing because a higher priority extension claimed its name is otherwise
   * invisible — and the invariant problems of the state, the check a development build runs after
   * every transaction.
   *
   * ```ts
   * console.log(editor.debug().invariants); // [] when the state is sound
   * ```
   */
  debug(): Record<string, unknown> {
    return {
      diagnostics: this.extensions.diagnostics(),
      document: this.getJSON(),
      invariants: checkStateInvariants(this.state),
      plugins: this.state.plugins.map((plugin) => ({
        name: plugin.key.name,
        state: this.state.pluginState(plugin.key),
      })),
      rejectedAppends: [...this.rejectedAppends],
      selection: this.state.selection.toJSON(),
      text: this.getText(),
    };
  }

  /**
   * Removes every listener and the view; the editor stays usable afterwards.
   *
   * Uploads still running are cancelled first: a request that outlives its editor would resolve
   * against a state nothing is showing and keep a socket open for a closed document.
   */
  destroy(): void {
    this.emit('destroy', { editor: this });
    abortUploadsFor(this.schema);
    this.detachView();
    this.listeners.clear();
  }

  /** Unregisters a view; a destroyed view does this. */
  detach(view: EditorViewLike): void {
    this.attachedViews.delete(view);

    if (this.viewInstance === view) {
      this.viewInstance = null;
    }
  }

  /** Detaches and destroys the editor's view, if any. */
  detachView(): void {
    const view = this.viewInstance;

    if (!view) {
      return;
    }

    this.attachedViews.delete(view);
    this.viewInstance = null;
    view.destroy();
  }

  /** Applies a transaction unless a plugin rejects it or the editor is read-only. */
  dispatch(transaction: Transaction): void {
    if (transaction.docChanged && !this.editable) {
      return;
    }

    const previous = this.state;
    const outcome = applyTransactionWithOutcome(previous, transaction);

    if (outcome.rejectedRoot) {
      return;
    }

    this.emit('beforeTransaction', { state: previous, transaction });

    this.state = outcome.state;

    // A plugin whose appended transaction was refused is worth reporting, because nothing about the
    // document shows it. Repeats are folded, since the same veto happens on every keystroke.
    for (const plugin of outcome.rejectedAppends) {
      if (!this.rejectedAppends.includes(plugin)) {
        this.rejectedAppends.push(plugin);
      }
    }

    // An upload has to land where its file was dropped, not where the selection is when the request
    // resolves, so its insertion point is carried through every transaction.
    updateUploadAnchors(this.schema, transaction);

    this.rememberTrace(transaction);

    if (this.options.validate) {
      const problems = checkStateInvariants(this.state);

      if (problems.length > 0) {
        throw invariantError(
          ErrorCode.INVALID_STATE,
          `Transaction left the editor in an inconsistent state: ${problems[0]!.message}`,
          { problems, transaction: transaction.toString() },
        );
      }
    }

    // The view renders what the state says, never the other way round, so even a selection-only
    // transaction reaches the browser — in every attached view, since a state change is not
    // addressed to one of them.
    for (const view of this.attachedViews) {
      view.update(this.state, transaction);
    }

    this.emit('transaction', { editor: this, state: this.state, transaction });

    if (this.state.doc !== previous.doc) {
      this.emit('update', { editor: this, state: this.state, transaction });
    }

    if (!this.state.selection.eq(previous.selection)) {
      this.emit('selectionUpdate', { editor: this, state: this.state, transaction });
    }
  }

  /** Moves the selection to the start of the document and focuses it. */
  focus(): void {
    if (this.viewInstance) {
      this.viewInstance.focus();

      return;
    }

    this.dispatch(this.state.tr.setSelection(TextSelection.at(this.state.doc, 1)));
  }

  /**
   * Attributes of the innermost node or mark named `name` at the selection. Both are spelled the
   * same way in the public API — `getAttributes('heading')` and `getAttributes('text_color')` — so
   * the schema decides which one is meant.
   */
  getAttributes(name: string): Attrs {
    const type = this.schema.nodes[name];

    if (type) {
      for (let depth = this.state.selection.$from.depth; depth > 0; depth--) {
        const current = this.state.selection.$from.node(depth);

        if (current.type === type) {
          return { ...current.attrs };
        }
      }
    }

    const mark = this.activeMark(name);

    return mark ? { ...mark.attrs } : {};
  }

  /** The document as HTML. */
  getHTML(): string {
    return serializeDocument(this.state.doc);
  }

  getJSON(): NodeJSON {
    return this.state.doc.toJSON();
  }

  getMarkdown(): string {
    return serializeMarkdown(this.state.doc);
  }

  getText(blockSeparator = '\n\n'): string {
    return toPlainText(this.state.doc, blockSeparator);
  }

  /** Whether `name` is active at the current selection. */
  isActive(name: string, attrs?: Attrs): boolean {
    const type = this.schema.marks[name];

    if (type) {
      return markActive(this.state, type, attrs);
    }

    const node = this.schema.nodes[name];

    if (!node) {
      return false;
    }

    for (let depth = this.state.selection.$from.depth; depth > 0; depth--) {
      const current = this.state.selection.$from.node(depth);

      if (current.type === node && matchesAttrs(current, attrs)) {
        return true;
      }
    }

    return false;
  }

  /** Registers an event listener; returns a remover for it. */
  on<T extends EditorEvent>(event: T, callback: EditorEventHandler<T>): () => void {
    const listeners = this.listeners.get(event) ?? new Set();

    listeners.add(callback as (payload: never) => void);
    this.listeners.set(event, listeners);

    return () => {
      listeners.delete(callback as (payload: never) => void);
    };
  }

  /** Registers a listener that removes itself after one call. */
  once<T extends EditorEvent>(event: T, callback: EditorEventHandler<T>): () => void {
    const off = this.on(event, (payload) => {
      off();
      callback(payload);
    });

    return off;
  }

  /**
   * Runs a command against the current state.
   *
   * The dispatch function it builds its transaction with is this editor's own, so a command handed
   * in from outside changes this editor and no other. It is marked as an unnamed command, because
   * nobody registered this one; `runNamedCommand` and the `commands` proxy report the name.
   */
  runCommand(command: Command): boolean {
    return this.commandManager.runCommand(this.state, command, (tr) =>
      this.dispatch(tr.setOriginIfUnset({ kind: 'command' })),
    );
  }

  /**
   * Runs the command a keyboard event maps to.
   *
   * Plugins get the first chance to handle the event, then the extensions' keymap is consulted.
   * A view passes a `keydown` here, so the core stays free of the DOM:
   *
   * ```ts
   * editor.runKey({ ctrlKey: true, key: 'b' }); // toggles bold
   * ```
   *
   * An entry naming a registered command reports that name as the origin, so `Mod-b` reads as
   * `command:toggleBold` in the trace.
   */
  runKey(event: KeyEventLike): boolean {
    for (const plugin of this.state.plugins) {
      if (plugin.spec.props?.handleKeyDown?.(event, this.state)) {
        event.preventDefault?.();

        return true;
      }
    }

    const shortcut = keyName(event);
    const command = this.shortcutMap[shortcut];
    const name = command ? this.commandNames.get(command) : undefined;

    if (!command || !this.runShortcut(command, name)) {
      return false;
    }

    event.preventDefault?.();

    return true;
  }

  /**
   * Runs a registered command by name.
   *
   * `editor.commands.toggleBold()` and this method do the same thing; the difference is what
   * happens when the name is wrong. The proxy returns `false` for a name that does not exist, which
   * reads like a command that declined to run, while this raises a {@link CommandError} naming the
   * command and listing what is available.
   *
   * ```ts
   * editor.runNamedCommand('insertImage', { src }); // options of the command factory
   * ```
   *
   * @throws {CommandError} when no extension registers `name`
   */
  runNamedCommand(name: string, options?: Attrs): boolean {
    const factory = this.commandManager.get(name);

    if (!factory) {
      throw commandError(ErrorCode.UNKNOWN_COMMAND, `Unknown command "${name}"`, {
        available: this.commandManager.names(),
        command: name,
      });
    }

    return this.commandManager.run(this.state, name, options);
  }

  /** Turns editing on or off in the editor and in every view. */
  setEditable(editable: boolean): void {
    this.editable = editable;

    for (const view of this.attachedViews) {
      view.setEditable(editable);
    }

    if (this.viewInstance && !this.attachedViews.has(this.viewInstance)) {
      this.viewInstance.setEditable(editable);
    }
  }

  /**
   * Replaces the document with the content of an HTML string; the caret ends up at the start of it.
   *
   * A selection write a view still held for the previous document is dropped first: it describes
   * a document nothing is showing, and letting it run would pull the caret to a position that no
   * longer exists.
   */
  setHTML(html: string): void {
    if (!viewModule) {
      throw invariantError(
        ErrorCode.VIEW_MODULE_MISSING,
        'No view module is registered: parsing HTML needs the view entry point',
      );
    }

    const content = viewModule.parseHTML(html, this.schema);
    const tr = this.state.tr;

    tr.replaceWith(0, this.state.doc.content.size, content);
    tr.setSelection(TextSelection.near(tr.doc, 1, 1));

    for (const view of this.attachedViews) {
      view.cancelPendingSelection?.();
    }

    this.dispatch(tr);
  }

  /** Replaces the document, leaving the caret at the start of the content. */
  setJSON(content: NodeJSON): void {
    const doc = this.schema.nodeFromJSON(content);
    const tr = this.state.tr;

    tr.replaceWith(0, this.state.doc.content.size, doc.content);
    tr.setSelection(TextSelection.near(tr.doc, 1, 1));

    for (const view of this.attachedViews) {
      view.cancelPendingSelection?.();
    }

    this.dispatch(tr);
  }

  /**
   * A readable trace of the last transactions the editor applied.
   *
   * The interesting part of a bug report is a sequence — which command ran, which steps it
   * produced, which plugin appended what, where the selection ended up — so this keeps the last
   * `limit` transactions and renders them as text.
   *
   * ```text
   * #2 origin=input steps=1 sel=3->4
   * #0 origin=system steps=0 sel=1->1
   * ```
   */
  traceTransactions(limit = 20): string {
    return this.traces
      .slice(-Math.max(0, limit))
      .reverse()
      .map((entry) => {
        const origin =
          entry.origin.command === undefined
            ? entry.origin.kind
            : `${entry.origin.kind}:${entry.origin.command}`;
        const steps = entry.steps.map((step) => step.type).join(', ') || 'none';

        return `#${entry.index} origin=${origin} steps=${entry.steps.length} [${steps}] sel=${entry.selection.from}->${entry.selection.to}`;
      })
      .join('\n');
  }

  /**
   * Builds the `commands` object: every registered name becomes a function that runs against the
   * current state, through the same manager `runNamedCommand` uses, so the two cannot drift apart.
   *
   * The command object of a keymap entry is remembered here too, which is what lets
   * {@link Editor.runKey} report the name a key ran under.
   */
  private buildCommands(): Record<string, (options?: Attrs) => boolean> {
    const commands: Record<string, (options?: Attrs) => boolean> = {};

    for (const name of this.commandManager.names()) {
      const factory = this.commandManager.get(name);

      if (factory) {
        this.commandNames.set(factory(), name);
      }

      commands[name] = (options?: Attrs): boolean =>
        this.commandManager.run(this.state, name, options);
    }

    return commands;
  }

  private emit<T extends EditorEvent>(event: T, payload: EditorEvents[T]): void {
    const listeners = this.listeners.get(event);

    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      (listener as (value: EditorEvents[T]) => void)(payload);
    }
  }

  /**
   * Records one applied transaction for {@link Editor.traceTransactions}. The trace is bounded: an
   * editor running for hours applies millions of transactions, and a debug buffer that grows with
   * them is a leak.
   */
  private rememberTrace(transaction: Transaction): void {
    this.traces.push({
      index: this.traceCounter,
      origin: transaction.origin,
      selection: { from: this.state.selection.from, to: this.state.selection.to },
      steps: transaction.steps.map((step) => step.toJSON()),
    });

    this.traceCounter += 1;

    if (this.traces.length > MAX_TRACES) {
      this.traces.shift();
    }
  }

  /** Runs `command`, reporting `name` as origin when known. */
  private runShortcut(command: Command, name: string | undefined): boolean {
    return this.commandManager.runCommand(this.state, command, (tr) =>
      this.dispatch(tr.setOriginIfUnset({ command: name, kind: 'command' })),
    );
  }
}

/** How many applied transactions `traceTransactions` can look back at. */
const MAX_TRACES = 100;

/** One applied transaction, as {@link Editor.traceTransactions} renders it. */
interface TransactionTrace {
  /** Sequence number, counting from the editor's first transaction. */
  index: number;
  origin: TransactionOrigin;
  selection: { from: number; to: number };
  steps: readonly StepJSON[];
}

export function hasViewModule(): boolean {
  return viewModule !== null;
}

/**
 * Registers the DOM half of the editor. Called as a side effect by the view entry point, so
 * importing the core never pulls the DOM in.
 */
export function registerViewModule(module: ViewModule): void {
  viewModule = module;
}

/** Whether every entry of `attrs` matches the node's attributes; absent `attrs` matches. */
function matchesAttrs(node: DocNode, attrs?: Attrs): boolean {
  if (!attrs) {
    return true;
  }

  return node.type.matchesAttrs(node.attrs, attrs);
}

/** Re-exported so consumers get plugin and keymap types from one module. */
export type { Keymap, Plugin };
