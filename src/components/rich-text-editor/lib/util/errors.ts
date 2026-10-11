/**
 * The error model.
 *
 * Every failure is one of the six classes below — {@link InvariantError}, {@link SchemaError},
 * {@link ConfigError}, {@link CommandError}, {@link SerializationError}, {@link ViewError} — each
 * carrying a stable {@link ErrorCode} and the {@link ErrorDetails} a caller reacts to without
 * parsing a message: the class says who is at fault, the code says what happened — it is API and
 * may only be added to, while the message may be reworded or translated — and the details carry
 * the values, so a host builds its own localized text. The core produces no user-facing copy
 * (design §79).
 *
 * ```ts
 * catch (error) {
 *   if (error instanceof EditorError && error.code === ErrorCode.UNKNOWN_NODE_TYPE) { ... }
 * }
 * ```
 */

/**
 * Machine-readable identity of a failure. A code is stable public API — never renamed and never
 * reused for a different condition — and a host maps it to its own message, so none of them is
 * meant to be shown to a user as-is.
 */
export const ErrorCode = {
  /** A depth the resolved position does not reach. */
  DEPTH_OUT_OF_RANGE: 'DEPTH_OUT_OF_RANGE',
  /** A document was checked against the schema and found invalid. */
  DOCUMENT_INVALID: 'DOCUMENT_INVALID',
  /** A DOM operation needs a document and none was available. */
  DOM_UNAVAILABLE: 'DOM_UNAVAILABLE',
  /** Two registered extensions carry the same name. */
  DUPLICATE_EXTENSION: 'DUPLICATE_EXTENSION',
  /** Two extensions contributed a mark with the same name. */
  DUPLICATE_MARK: 'DUPLICATE_MARK',
  /** Two extensions contributed a node with the same name. */
  DUPLICATE_NODE: 'DUPLICATE_NODE',
  /** `EditorState.create` was given neither a schema nor a document. */
  EDITOR_STATE_WITHOUT_INPUT: 'EDITOR_STATE_WITHOUT_INPUT',
  /** The editable element could not be found. */
  ELEMENT_NOT_FOUND: 'ELEMENT_NOT_FOUND',
  /** An extension was asked for its context before it was bound to an editor. */
  EXTENSION_NOT_BOUND: 'EXTENSION_NOT_BOUND',
  /** An attribute value does not satisfy its spec. */
  INVALID_ATTRIBUTE: 'INVALID_ATTRIBUTE',
  /** Content checked against a node spec that does not allow it. */
  INVALID_CONTENT: 'INVALID_CONTENT',
  /** A content expression in a node spec cannot be parsed. */
  INVALID_CONTENT_EXPRESSION: 'INVALID_CONTENT_EXPRESSION',
  /** A configurable option was given an unusable value. */
  INVALID_OPTION: 'INVALID_OPTION',
  /** An iteration range that is not usable. */
  INVALID_RANGE: 'INVALID_RANGE',
  /** A transaction left the state breaking one of its invariants. */
  INVALID_STATE: 'INVALID_STATE',
  /** HTML or JSON input could not be read. */
  MALFORMED_INPUT: 'MALFORMED_INPUT',
  /** A document cannot be built because the schema declares no block node. */
  NO_BLOCK_NODE: 'NO_BLOCK_NODE',
  /** A child index the fragment does not have. */
  NO_SUCH_CHILD: 'NO_SUCH_CHILD',
  /** The schema declares no `text` node type, so text cannot be represented. */
  NO_TEXT_NODE: 'NO_TEXT_NODE',
  /** The schema declares no top node with that name. */
  NO_TOP_NODE: 'NO_TOP_NODE',
  /** A plugin did not produce the transaction it was expected to. */
  PLUGIN_PRODUCED_NO_TRANSACTION: 'PLUGIN_PRODUCED_NO_TRANSACTION',
  /** The position module was not imported, so `doc.resolve` has no implementation. */
  POSITION_MODULE_MISSING: 'POSITION_MODULE_MISSING',
  /** A range or position was resolved against a document that does not contain it. */
  POSITION_OUT_OF_RANGE: 'POSITION_OUT_OF_RANGE',
  /** The range module was not imported, so `doc.range` has no implementation. */
  RANGE_MODULE_MISSING: 'RANGE_MODULE_MISSING',
  /** A replacement child does not have the size the position model requires. */
  REPLACEMENT_SIZE_MISMATCH: 'REPLACEMENT_SIZE_MISMATCH',
  /** A slice's open depth exceeds the depth of its content. */
  SLICE_DEPTH_EXCEEDED: 'SLICE_DEPTH_EXCEEDED',
  /** A transaction was applied to a state it was not built from. */
  STALE_TRANSACTION: 'STALE_TRANSACTION',
  /** A step type does not implement `map`, so it cannot be mapped through a concurrent change. */
  STEP_MAPPING_REQUIRED: 'STEP_MAPPING_REQUIRED',
  /** Text nodes were given attributes, which the model does not support. */
  TEXT_NODE_WITH_ATTRIBUTES: 'TEXT_NODE_WITH_ATTRIBUTES',
  /** An attribute bag carried a key the type does not declare. */
  UNKNOWN_ATTRIBUTE: 'UNKNOWN_ATTRIBUTE',
  /** A command name was run that the editor does not have. */
  UNKNOWN_COMMAND: 'UNKNOWN_COMMAND',
  /** A mark type was looked up by an undeclared name. */
  UNKNOWN_MARK_TYPE: 'UNKNOWN_MARK_TYPE',
  /** A node type was looked up by an undeclared name. */
  UNKNOWN_NODE_TYPE: 'UNKNOWN_NODE_TYPE',
  /** A plugin was looked up by a key the state does not carry. */
  UNKNOWN_PLUGIN_KEY: 'UNKNOWN_PLUGIN_KEY',
  /** The DOM reports a clipboard payload shape the editor cannot read. */
  UNREADABLE_CLIPBOARD: 'UNREADABLE_CLIPBOARD',
  /** A selection was placed at a position the document cannot resolve. */
  UNRESOLVABLE_POSITION: 'UNRESOLVABLE_POSITION',
  /** The view entry point was not imported, so no DOM half is registered. */
  VIEW_MODULE_MISSING: 'VIEW_MODULE_MISSING',
} as const;

/** Stable name of a failure condition. */
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Values attached to a failure; a host renders its own message from these, so every field the
 * message mentions has to be here too.
 */
export type ErrorDetails = Readonly<Record<string, unknown>>;

/**
 * Base class of every error the editor raises: catch it for all of them, a subclass for a category,
 * or read {@link EditorError.code} for one condition.
 */
export class EditorError extends Error {
  /**
   * Stable identity of the condition. Assigned in the constructor rather than declared as a class
   * field: a field would make the compiled output depend on a helper the legacy bundle cannot
   * afford.
   */
  readonly code!: ErrorCode;

  /** Values the message is built from. */
  readonly details!: ErrorDetails;

  constructor(code: ErrorCode, message: string, details: ErrorDetails = {}) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.details = details;

    // Keeps a subclass identity through a downlevel `extends`, and the stack at the throw site.
    Object.setPrototypeOf(this, new.target.prototype);

    // V8 keeps the stack at the throw site through this hook; it is absent in other engines and in
    // the DOM types, so the call is made through the object rather than off the constructor.
    const captureStackTrace: unknown = Reflect.get(Error, 'captureStackTrace');

    if (typeof captureStackTrace === 'function') {
      (captureStackTrace as (target: object, constructor?: unknown) => void)(this, new.target);
    }
  }

  /**
   * Plain object form, for logs, telemetry and worker boundaries: a message crossing one is
   * a string, a code and its details are not, so this is what a transport should send.
   */
  toJSON(): { code: ErrorCode; details: ErrorDetails; message: string; name: string } {
    return {
      code: this.code,
      details: this.details,
      message: this.message,
      name: this.name,
    };
  }
}

/** Error type for a command the editor cannot run. */
export class CommandError extends EditorError {}

/**
 * Error type for invalid editor options: a wiring mistake made while an editor is being built.
 */
export class ConfigError extends EditorError {}

/** Violation of an internal invariant; always a bug in the editor itself. */
export class InvariantError extends EditorError {}

/**
 * Error type for violations of the document schema, which is the single source of truth, so
 * a caller can tell a programming mistake from a runtime failure.
 */
export class SchemaError extends EditorError {}

/**
 * Error type for malformed JSON / serialized input: `setJSON`, pasted or dropped HTML, a clipboard
 * payload.
 */
export class SerializationError extends EditorError {}

/**
 * Error type for the DOM half: the environment lacks what the view needs — no document, no matching
 * element, an unreadable clipboard payload — not that the document is wrong.
 */
export class ViewError extends EditorError {}

/**
 * Builds a {@link CommandError}.
 *
 * @internal
 */
export function commandError(
  code: ErrorCode,
  message: string,
  details?: ErrorDetails,
): CommandError {
  return new CommandError(code, message, details);
}

/**
 * Builds a {@link ConfigError}.
 *
 * @internal
 */
export function configError(code: ErrorCode, message: string, details?: ErrorDetails): ConfigError {
  return new ConfigError(code, message, details);
}

/**
 * Builds an {@link InvariantError}.
 *
 * @internal
 */
export function invariantError(
  code: ErrorCode,
  message: string,
  details?: ErrorDetails,
): InvariantError {
  return new InvariantError(code, message, details);
}

/**
 * Whether `value` is an editor error, across realms: a bundle, worker or frame can hold a second
 * copy of this class, where `instanceof` misses the editor's own errors, while the code and the
 * class name survive that boundary.
 */
export function isEditorError(value: unknown): value is EditorError {
  if (value instanceof EditorError) {
    return true;
  }

  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as { code?: unknown; name?: unknown };

  return (
    typeof candidate.code === 'string' &&
    typeof candidate.name === 'string' &&
    candidate.name in ERROR_BY_NAME
  );
}

/**
 * Builds a {@link SchemaError}.
 *
 * @internal
 */
export function schemaError(code: ErrorCode, message: string, details?: ErrorDetails): SchemaError {
  return new SchemaError(code, message, details);
}

/**
 * Builds a {@link SerializationError}.
 *
 * @internal
 */
export function serializationError(
  code: ErrorCode,
  message: string,
  details?: ErrorDetails,
): SerializationError {
  return new SerializationError(code, message, details);
}

/**
 * Builds a {@link ViewError}.
 *
 * @internal
 */
export function viewError(code: ErrorCode, message: string, details?: ErrorDetails): ViewError {
  return new ViewError(code, message, details);
}

/** Class name to class, for the cross-realm check in `isEditorError`. */
const ERROR_BY_NAME: Record<string, unknown> = {
  CommandError,
  ConfigError,
  InvariantError,
  SchemaError,
  SerializationError,
  ViewError,
};
