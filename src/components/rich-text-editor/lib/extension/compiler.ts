import type { Command } from '../command/command.ts';
import type { MarkSpec } from '../schema/mark-spec.ts';
import type { NodeSpec } from '../schema/node-spec.ts';
import type {
  AnyPlugin,
  Extension,
  InputRule,
  Keymap,
  RuntimeExtensionContext,
  SchemaExtensionContext,
} from './extension.ts';

import { ErrorCode, invariantError } from '../util/errors.ts';

/**
 * The result of reading every extension once.
 *
 * A declaration is worth reading exactly once: a hook may allocate a plugin, close over an option
 * bag or register a runtime, so calling it again for each question would hand the editor two
 * different plugins where the author wrote one.
 *
 * ```ts
 * const registry = compileExtensions(extensions, context);
 *
 * registry.commands['toggleBold']!({});   // the winning command
 * ```
 */
export interface CompiledExtensions extends CompiledSchemaSpecs {
  /** Command factories by name; a higher priority extension wins. */
  readonly commands: Record<string, (options?: Record<string, unknown>) => Command>;
  /** Input rules of every extension, in priority order. */
  readonly inputRules: readonly InputRule[];
  /**
   * Keyboard shortcuts; a higher priority extension wins, and the first one compiled wins a tie.
   */
  readonly keymap: Keymap;
  /** Plugin instances, one per declaration, in priority order. */
  readonly plugins: readonly AnyPlugin[];
}

/** Node and mark specs of every extension, which is what a schema is built from. */
export interface CompiledSchemaSpecs {
  /**
   * Collisions the first phase resolved, oldest first, so the registry carries every diagnostic of
   * the whole compile — including a node or mark that `replace: true` took over.
   */
  readonly diagnostics: readonly ExtensionDiagnostic[];
  /** Name of the extension that contributed each mark, by mark name. */
  readonly markOwners: Readonly<Record<string, string>>;
  /** Mark specs by name, merged in priority order. */
  readonly markSpecs: Record<string, MarkSpec>;
  /** Name of the extension that contributed each node, by node name. */
  readonly nodeOwners: Readonly<Record<string, string>>;
  /** Node specs by name, merged in priority order. */
  readonly nodeSpecs: Record<string, NodeSpec>;
}

/** One contribution that a later extension or an explicit `replace` took over. */
export interface ExtensionDiagnostic {
  /** What was overridden. */
  readonly kind: 'command' | 'keymap' | 'mark' | 'node' | 'plugin';
  /** Name of the contribution, e.g. the command or node type. */
  readonly name: string;
  /** Extension that contributed it. */
  readonly replaced: string;
  /** Extension whose contribution won. */
  readonly winner: string;
}

/**
 * Policy of one contribution type — the five kinds are not equally interchangeable, so each rule
 * is stated here rather than left to the merge loop:
 *
 * | Contribution | Rule |
 * | --- | --- |
 * | Node, Mark | a duplicate name is an error; `replace: true` on the spec takes it over |
 * | Command | the higher priority extension wins |
 * | Keymap | the higher priority extension wins |
 * | Plugin | flattened, in priority order |
 * | Input rule | flattened, in priority order |
 *
 * `replace: true` belongs to the spec rather than to priority because replacing a node type has
 * consequences for every document built against the schema.
 */
export function compileExtensions(
  extensions: readonly Extension[],
  context: RuntimeExtensionContext,
  schemaSpecs?: CompiledSchemaSpecs,
): CompiledExtensions {
  const sorted = sortByPriority(extensions);
  const diagnostics: ExtensionDiagnostic[] = [];
  // A second call to `addNodes`/`addMarks` could return something else — a fresh object, a
  // different branch — and leave the registry describing a schema the editor is not using.
  const specs = schemaSpecs ?? compileSchemaSpecs(sorted, context);

  for (const diagnostic of specs.diagnostics) {
    diagnostics.push(diagnostic);
  }

  return {
    ...specs,
    commands: compileCommands(sorted, context, diagnostics),
    diagnostics,
    inputRules: sorted.flatMap((extension) => [
      ...(extension.addInputRules?.(contextForExtension(context, extension)) ?? []),
    ]),
    keymap: compileKeymap(sorted, context, diagnostics),
    plugins: sorted.flatMap((extension) => [
      ...(extension.addPlugins?.(contextForExtension(context, extension)) ?? []),
    ]),
  };
}

/**
 * Reads the node and mark specs of every extension.
 *
 * This is the first of the two steps `compileExtensions` takes: a schema is built from these
 * specs, and the contributions after them are handed that schema, so they cannot be read first.
 *
 * ```ts
 * const specs = compileSchemaSpecs(extensions, context);
 * const schema = new Schema({ nodes: specs.nodeSpecs, marks: specs.markSpecs });
 * ```
 */
export function compileSchemaSpecs(
  extensions: readonly Extension[],
  context: SchemaExtensionContext,
): CompiledSchemaSpecs {
  const sorted = sortByPriority(extensions);
  const diagnostics: ExtensionDiagnostic[] = [];
  const marks = compileSpecs(sorted, context, 'mark', diagnostics);
  const nodes = compileSpecs(sorted, context, 'node', diagnostics);

  return {
    diagnostics,
    markOwners: marks.owners,
    markSpecs: marks.specs as Record<string, MarkSpec>,
    nodeOwners: nodes.owners,
    nodeSpecs: nodes.specs as Record<string, NodeSpec>,
  };
}

/**
 * Builds the context one extension hook is called with.
 *
 * The extension's own options and storage are what make it a unit: two extensions reading
 * `context.storage.get('cache')` get two bags, and `Image.configure({ upload })` is visible to
 * every hook of that declaration. Everything else keeps its phase, so a schema-phase context hands
 * on no schema. A bag is created on first use and kept for the life of the editor.
 */
export function contextForExtension<Context extends SchemaExtensionContext>(
  context: Context,
  extension: Extension,
): Context {
  const existing = context.extensionStorage.get(extension);
  const storage = existing ?? new Map<string, unknown>();

  if (!existing) {
    context.extensionStorage.set(extension, storage);
  }

  return {
    ...context,
    options: extension.options ?? {},
    storage,
  };
}

/**
 * Extensions by descending priority. A stable sort, so equal priority keeps registration order:
 * `priority` is how a host overrides a default, and equal priority means "no opinion".
 */
export function sortByPriority(extensions: readonly Extension[]): Extension[] {
  return [...extensions].sort((a, b) => (b.priority ?? 100) - (a.priority ?? 100));
}

/** Named commands of every extension, where the higher priority one keeps the name. */
function compileCommands(
  extensions: readonly Extension[],
  context: RuntimeExtensionContext,
  diagnostics: ExtensionDiagnostic[],
): Record<string, (options?: Record<string, unknown>) => Command> {
  const commands: Record<string, (options?: Record<string, unknown>) => Command> = {};
  const owner = new Map<string, string>();

  for (const extension of extensions) {
    const contributed = extension.addCommands?.(contextForExtension(context, extension)) ?? {};

    for (const [name, factory] of Object.entries(contributed)) {
      const previous = owner.get(name);

      if (previous !== undefined) {
        // The list is in descending priority, so the first claim on a name came from an extension
        // ranked at least as high; the later one is the override that lost.
        diagnostics.push({
          kind: 'command',
          name,
          replaced: extension.name,
          winner: previous,
        });

        continue;
      }

      owner.set(name, extension.name);
      commands[name] = factory as (options?: Record<string, unknown>) => Command;
    }
  }

  return commands;
}

/** Keyboard shortcuts of every extension, where the higher priority one keeps the key. */
function compileKeymap(
  extensions: readonly Extension[],
  context: RuntimeExtensionContext,
  diagnostics: ExtensionDiagnostic[],
): Keymap {
  const keymap: Keymap = {};
  const owner = new Map<string, string>();

  for (const extension of extensions) {
    for (const [shortcut, command] of Object.entries(
      extension.addKeyboardShortcuts?.(contextForExtension(context, extension)) ?? {},
    )) {
      const previous = owner.get(shortcut);

      if (previous !== undefined) {
        diagnostics.push({
          kind: 'keymap',
          name: shortcut,
          replaced: extension.name,
          winner: previous,
        });

        continue;
      }

      owner.set(shortcut, extension.name);
      keymap[shortcut] = command;
    }
  }

  return keymap;
}

/**
 * Node or mark specs of every extension. A duplicate name is an error, because two extensions
 * describing one node type cannot both be right; one that means to take a type over says so on the
 * spec with `replace: true`, where the decision stays visible.
 */
function compileSpecs(
  extensions: readonly Extension[],
  baseContext: SchemaExtensionContext,
  kind: 'mark' | 'node',
  diagnostics: ExtensionDiagnostic[],
): { owners: Record<string, string>; specs: Record<string, MarkSpec | NodeSpec> } {
  const specs: Record<string, MarkSpec | NodeSpec> = {};
  const owner = new Map<string, string>();

  for (const extension of extensions) {
    const context = contextForExtension(baseContext, extension);
    const contributed =
      (kind === 'node' ? extension.addNodes?.(context) : extension.addMarks?.(context)) ?? {};

    for (const [name, spec] of Object.entries(contributed)) {
      const previous = owner.get(name);
      const replaces = spec.replace === true;

      if (previous !== undefined && !replaces) {
        throw invariantError(
          kind === 'node' ? ErrorCode.DUPLICATE_NODE : ErrorCode.DUPLICATE_MARK,
          `Two extensions both define the ${kind} "${name}"; declare \`replace: true\` on one of them to take it over`,
          {
            first: previous,
            [kind === 'node' ? 'nodeType' : 'markType']: name,
            second: extension.name,
          },
        );
      }

      if (previous !== undefined) {
        diagnostics.push({ kind, name, replaced: previous, winner: extension.name });
      }

      owner.set(name, extension.name);
      specs[name] = { ...spec, name } as MarkSpec | NodeSpec;
    }
  }

  return { owners: Object.fromEntries(owner), specs };
}
