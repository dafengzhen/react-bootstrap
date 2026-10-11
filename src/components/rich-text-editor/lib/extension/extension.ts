import type { Command } from '../command/command.ts';
import type { Editor } from '../editor.ts';
import type { MarkType } from '../model/mark-type.ts';
import type { NodeType } from '../model/node-type.ts';
import type { MarkSpec } from '../schema/mark-spec.ts';
import type { NodeSpec } from '../schema/node-spec.ts';
import type { Schema } from '../schema/schema.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { Plugin } from '../state/plugin.ts';
import type { Transaction } from '../state/transaction.ts';
import type { Attrs } from '../util/object.ts';
import type { CompiledExtensions, CompiledSchemaSpecs, ExtensionDiagnostic } from './compiler.ts';

import { Plugin as PluginClass } from '../state/plugin.ts';
import { configError, ErrorCode, invariantError } from '../util/errors.ts';
import { compileExtensions, compileSchemaSpecs, sortByPriority } from './compiler.ts';

/**
 * An extension is the business level extension API: it bundles plugins, node and mark specs,
 * commands, shortcuts and input rules into one named unit that a user can configure.
 *
 * ```ts
 * const editor = new Editor({ extensions: [StarterKit, Image, Table] });
 * ```
 */
export type AnyPlugin = Plugin<any>;

/**
 * A context of either phase, as `Editor` holds it while it is being built: the schema-phase shape
 * with room for the schema, which a spread of either phase is assignable to and
 * {@link contextHasSchema} narrows once the schema is in. Use {@link createExtensionContext} to
 * drive an {@link ExtensionManager} directly.
 */
export type BoundExtensionContext = {
  extensionStorage: Map<Extension, Map<string, unknown>>;
} & Omit<SchemaExtensionContext, 'extensionStorage'> &
  Partial<Pick<RuntimeExtensionContext, 'schema'>>;

/** A command contributed by an extension. */
export interface CommandExtension {
  /** The command itself. */
  command: (options?: Attrs) => Command;
  /** Name the command is registered under. */
  name: string;
}

/** Extension declaration. */
export interface Extension<Options extends Attrs = Attrs> {
  /** Command factories contributed by this extension. */
  addCommands?: (context: RuntimeExtensionContext) => Record<string, (options?: Attrs) => Command>;
  /** Input rules contributed by this extension. */
  addInputRules?: (context: RuntimeExtensionContext) => readonly InputRule[];
  /** Keyboard shortcuts contributed by this extension. */
  addKeyboardShortcuts?: (context: RuntimeExtensionContext) => Keymap;
  /** Mark types contributed by this extension. */
  addMarks?: (context: SchemaExtensionContext) => Record<string, MarkSpec>;
  /** Node types contributed by this extension. */
  addNodes?: (context: SchemaExtensionContext) => Record<string, NodeSpec>;
  /**
   * Plugins contributed by this extension.
   *
   * The plugin state type is erased: a plugin owns its own state and exposes it through its key.
   */
  addPlugins?: (context: RuntimeExtensionContext) => readonly AnyPlugin[];
  /** Unique name of the extension. */
  name: string;
  /** Configuration values of this extension. */
  options?: Options;
  /** Higher priority extensions register their nodes first. */
  priority?: number;
}

/** Context handed to an extension hook. */
export type ExtensionContext = RuntimeExtensionContext | SchemaExtensionContext;

/** A pattern typed at the cursor and the transaction it produces. */
export interface InputRule {
  /** Transforms the state when the pattern matches. */
  handler: (state: EditorState, match: RegExpExecArray) => null | Transaction;
  /** Matched against the text in front of the cursor. */
  pattern: RegExp;
}

/** `Mod-b` style strings to commands. */
export type Keymap = Record<string, Command>;

/** A mark type contributed by an extension. */
export interface MarkExtension {
  /** Attribute defaults are declared in the spec. */
  spec: MarkSpec;
}

/** A node type contributed by an extension. */
export interface NodeExtension {
  /** Attribute defaults are declared in the spec. */
  spec: NodeSpec;
}

/** Context handed to an extension once the schema exists. */
export interface RuntimeExtensionContext extends SchemaExtensionContext {
  /**
   * Schema the editor was built with. It is absent while the schema is being built, so `addNodes`
   * and `addMarks` are handed a {@link SchemaExtensionContext}, and a hook that needs the schema
   * has to be one of the later ones — which makes reading it too early a compile error instead of
   * `Cannot read properties of null` inside a hook.
   */
  schema: Schema;
}

/** Context handed to an extension before the schema exists. */
export interface SchemaExtensionContext {
  /** The editor the extension is registered in. */
  editor: Editor;
  /**
   * Storage of every extension, keyed by declaration.
   *
   * Filled in by {@link createExtensionContext}; a hook sees its own bag through
   * {@link SchemaExtensionContext.storage}.
   *
   * @internal
   */
  extensionStorage: Map<Extension, Map<string, unknown>>;
  /**
   * Options the extension was configured with.
   *
   * A hook sees the options of the extension it belongs to, so
   * `Image.configure({ upload }).addCommands` reads `context.options.upload`, and an extension that
   * was not configured sees `{}`.
   */
  options: Attrs;
  /**
   * Free-form storage of *this* extension.
   *
   * One map per extension per editor, so two extensions that both use the key `"cache"` do not
   * share a value, and one registered twice keeps two independent bags. The map lives as long as
   * the editor and no transaction clears it.
   */
  storage: Map<string, unknown>;
}

/**
 * Collects the contributions of every extension, in priority order.
 *
 * The manager reads its extensions exactly once: the first time a contribution is asked for, every
 * hook runs and the result is frozen into a {@link CompiledExtensions} registry that answers all
 * later questions, so a hook that allocates a plugin or registers a runtime runs once per editor.
 * Priority rules are stated in `compileExtensions`, and {@link ExtensionManager.diagnostics}
 * reports the collisions.
 *
 * ```ts
 * const manager = new ExtensionManager([StarterKit]);
 *
 * manager.bind(context);           // once the schema exists
 * manager.compiled().commands;     // every hook has run by now
 * ```
 */
export class ExtensionManager {
  /** Extensions sorted by descending priority. */
  readonly extensions: readonly Extension[];

  /** Whether `bind` has been called. */
  get bound(): boolean {
    return this.editableContext !== null;
  }

  private editableContext: BoundExtensionContext | null = null;

  /** Storage per extension, so a hook always sees its own bag. */
  private extensionStorage = new Map<Extension, Map<string, unknown>>();

  private registry: CompiledExtensions | null = null;

  private schemaSpecsResult: CompiledSchemaSpecs | null = null;

  constructor(extensions: readonly Extension[] = []) {
    assertUniqueNames(extensions);

    this.extensions = sortByPriority(extensions);
  }

  /**
   * Binds the manager to an editor, so contributions can be evaluated.
   *
   * It accepts the context of either phase because binding happens before the schema exists, and
   * the editor adds the schema in place. It is also the one place a manager starts over, so a
   * rebind reads the hooks again instead of answering from the previous editor's registry.
   *
   * Starting over includes the storage: the map the context carries is adopted as this manager's
   * container — the same `Map` instance, so a caller holding it observes every bag the hooks write
   * — and its previous contents are **cleared**. A bag is the memory of one bound editor, and a
   * manager bound to a second editor that could still see the first one's keys would answer from
   * state that belongs to a document nobody is showing. `editor` builds its own context, so this
   * only concerns a caller that drives a manager directly; {@link createExtensionContext} documents
   * what such a caller gets.
   */
  bind(context: BoundExtensionContext): void {
    this.editableContext = context;
    this.registry = null;
    this.schemaSpecsResult = null;
    this.extensionStorage = context.extensionStorage;
    this.extensionStorage.clear();
  }

  /** Command factories; a higher priority extension keeps a name. */
  commands(): Record<string, (options?: Attrs) => Command> {
    return this.compiled().commands as Record<string, (options?: Attrs) => Command>;
  }

  /**
   * The compiled registry.
   *
   * @throws {InvariantError} when the manager was never bound to an editor
   * @throws {InvariantError} when the schema does not exist yet, because the contributions this
   *   reads are handed that schema
   */
  compiled(): CompiledExtensions {
    if (this.registry) {
      return this.registry;
    }

    const context = this.requireContext();
    const specs = this.schemaSpecsResult ?? compileSchemaSpecs(this.extensions, context);

    this.schemaSpecsResult = specs;

    // The first phase is handed in: `addNodes` and `addMarks` already ran for the schema, and
    // a hook called twice can answer differently the second time.
    this.registry = compileExtensions(this.extensions, context, specs);

    return this.registry;
  }

  /** Collisions priority or `replace: true` resolved, oldest first. */
  diagnostics(): readonly ExtensionDiagnostic[] {
    return this.compiled().diagnostics;
  }

  /**
   * First extension, in priority order, for which `predicate` holds.
   *
   * `Editor` uses it to find the extension that declares the schema's root node, whose options say
   * what a blank document starts with — the same node specs the schema was built from.
   */
  find(predicate: (extension: Extension) => boolean): Extension | undefined {
    return this.extensions.find(predicate);
  }

  /** Extension registered under `name`, if any. */
  get(name: string): Extension | undefined {
    return this.extensions.find((extension) => extension.name === name);
  }

  /** Input rules, flattened. */
  inputRules(): InputRule[] {
    return [...this.compiled().inputRules];
  }

  /** Keyboard shortcuts; a higher priority extension keeps a key. */
  keymap(): Keymap {
    return this.compiled().keymap;
  }

  /** Extension that contributed each mark, by mark name. */
  markOwners(): Readonly<Record<string, string>> {
    return this.compiled().markOwners;
  }

  /** Mark specs, merged in priority order. */
  markSpecs(): Record<string, MarkSpec> {
    return this.compiled().markSpecs;
  }

  /**
   * Name of every registered extension: unlike the contribution readers this needs no schema and
   * touches no hook, so it works on an unbound manager too.
   */
  names(): string[] {
    return this.extensions.map((extension) => extension.name);
  }

  /** Extension that contributed each node, by node name. */
  nodeOwners(): Readonly<Record<string, string>> {
    return this.compiled().nodeOwners;
  }

  /** Node specs, merged in priority order. */
  nodeSpecs(): Record<string, NodeSpec> {
    return this.compiled().nodeSpecs;
  }

  /** Plugins of every extension, flattened. */
  plugins(): AnyPlugin[] {
    return [...this.compiled().plugins];
  }

  /**
   * Node and mark specs of every extension, which is what a schema is built from.
   *
   * It runs before the schema exists and runs once: the result is cached and the registry reuses
   * it rather than calling `addNodes` and `addMarks` again, which could hand the editor a second
   * set of types and plugins. Nothing here invalidates that cache — `bind()` is the only place that
   * resets it.
   */
  schemaSpecs(): CompiledSchemaSpecs {
    this.schemaSpecsResult ??= compileSchemaSpecs(this.extensions, this.boundContext());

    return this.schemaSpecsResult;
  }

  /**
   * The context a phase reads, with the storage map this manager owns: `options` and `storage`
   * belong to one extension and {@link contextForExtension} fills them in per hook, while this
   * carries the rest, including the manager's own map, which the editor cannot know about.
   *
   * @throws {InvariantError} when the manager was never bound to an editor
   */
  private boundContext(): BoundExtensionContext {
    if (!this.editableContext) {
      throw invariantError(
        ErrorCode.EXTENSION_NOT_BOUND,
        'ExtensionManager is not bound to an editor',
      );
    }

    return this.editableContext;
  }

  /**
   * The context of a phase whose contributions are handed the schema.
   *
   * @throws {InvariantError} when the manager was never bound to an editor
   * @throws {InvariantError} when the schema does not exist yet
   */
  private requireContext(): RuntimeExtensionContext {
    const context = this.boundContext();

    if (!contextHasSchema(context)) {
      throw invariantError(
        ErrorCode.EXTENSION_NOT_BOUND,
        'Extensions can only be compiled once the schema exists; read the node and mark specs with `schemaSpecs()` first',
      );
    }

    return context;
  }
}

/**
 * Configures an extension instance: extensions are declarations, so `Image.configure({ upload })`
 * returns a new, independent one.
 */
export function configureExtension<Options extends Attrs>(
  extension: Extension<Options>,
  options: Options,
): Extension<Options> {
  return { ...extension, options: { ...(extension.options ?? ({} as Options)), ...options } };
}

/**
 * Whether a context already carries the schema: the two phases are two types, and this is the
 * refinement between them, which is why the check tests the property instead of casting.
 */
export function contextHasSchema(
  context: BoundExtensionContext,
): context is BoundExtensionContext & RuntimeExtensionContext {
  return !!context.schema;
}

/**
 * Builds the context an editor hands to its extension manager.
 *
 * The editor owns it for its own lifetime, while the manager fills in the two parts belonging to
 * an extension — its options and its storage — on every hook call. The schema is deliberately
 * absent, because the hooks that read node and mark specs are what the schema is built from; the
 * editor adds it in place, and `bind` turns the context a schema-phase hook saw into the one later
 * hooks see.
 *
 * Most hosts let {@link Editor} build this; it is public for callers that drive an
 * {@link ExtensionManager} directly. A supplied `storage` map is adopted **as the manager's own
 * container** on `bind`: the same `Map` instance comes back, so the caller can watch the bag of
 * every extension, and {@link ExtensionManager.bind} empties it first. Prefilling it therefore has
 * no effect — a bag belongs to the editor a manager is bound to, not to the map object, and the
 * keys are the `Extension` declarations themselves rather than names a host could reconstruct.
 * Pass an empty map to observe; keep your own state somewhere else to restore it.
 */
export function createExtensionContext(
  editor: Editor,
  storage: Map<Extension, Map<string, unknown>> = new Map(),
): BoundExtensionContext {
  return {
    editor,
    extensionStorage: storage,
    options: {},
    storage: new Map(),
  };
}

/**
 * Returns `extension` unchanged, so a declaration can be written where it is defined: nothing is
 * added at runtime, and the type parameter keeps an extension's configured `options` type attached.
 */
export function defineExtension<Options extends Attrs>(
  extension: Extension<Options>,
): Extension<Options> {
  return extension;
}

/**
 * Refuses a list in which two extensions carry the same name: a name is how a contribution is
 * attributed — `nodeOwners`, diagnostics, `debug()` — and how a host looks an extension up, and the
 * mistake is reported where the extensions are registered.
 *
 * @throws {ConfigError} when two extensions have the same name
 */
function assertUniqueNames(extensions: readonly Extension[]): void {
  const seen = new Set<string>();

  for (const extension of extensions) {
    if (seen.has(extension.name)) {
      throw configError(
        ErrorCode.DUPLICATE_EXTENSION,
        `Two extensions are named "${extension.name}"; an extension name has to be unique because contributions and diagnostics are attributed by it`,
        { extension: extension.name },
      );
    }

    seen.add(extension.name);
  }
}

/** Re-exported so extension authors need a single import. */
export type { MarkType, NodeType, Plugin };
export { PluginClass };
