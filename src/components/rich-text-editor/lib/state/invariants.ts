import type { Node } from '../model/node.ts';
import type { ValidationError } from '../schema/check.ts';
import type { Schema } from '../schema/schema.ts';
import type { EditorState } from './editor-state.ts';
import type { Transaction } from './transaction.ts';

import { checkDocument } from '../schema/check.ts';

/**
 * What has to hold for an editor state to be usable.
 *
 * A transaction is applied by a pipeline of steps — filter, apply, map the selection, advance the
 * plugin states, append what a plugin asked for — and every step assumes the one before it left a
 * state the next one can read: a document the schema accepts, a selection inside that document, a
 * plugin state per registered plugin. When an assumption breaks, the failure shows up far from
 * its cause: a selection one position past the end of a block produces a wrong caret twenty
 * transactions later, and a document that stopped satisfying its schema produces a serializer
 * crash in a save handler.
 *
 * So the invariants are checkable, and an editor built with `validate` checks them after every
 * transaction. That is the difference between finding a bug where it was caused and finding it
 * where it happened to surface.
 *
 * ```ts
 * if (process.env.NODE_ENV !== 'production') {
 *   const problems = checkStateInvariants(state);
 *
 *   if (problems.length > 0) {
 *     console.error(problems[0]!.message);
 *   }
 * }
 * ```
 */
export interface StateInvariantProblem {
  /** What is wrong; stable, so a caller can branch on it. */
  code:
    | 'DOCUMENT_INVALID'
    | 'DUPLICATE_PLUGIN_KEY'
    | 'PLUGIN_STATE_MISSING'
    | 'SELECTION_OUT_OF_RANGE'
    | 'SELECTION_UNRESOLVABLE'
    | 'STALE_TRANSACTION'
    | 'WRONG_SCHEMA';
  /** Extra values the message does not spell out. */
  details: Readonly<Record<string, unknown>>;
  /** Human readable explanation. Not part of the API contract. */
  message: string;
}

/** Runs the invariant checks a development build runs, throwing on the first problem. */
export function assertStateInvariants(state: EditorState): void {
  const problems = checkStateInvariants(state);

  if (problems.length > 0) {
    throw new Error(
      `Editor state broke an invariant: ${problems[0]!.message} (${problems[0]!.code})`,
    );
  }
}

/**
 * Every invariant `state` breaks.
 *
 * Used by a development build and by tests. Calling it after every transaction in production
 * would walk the whole document on every keystroke, which is why it is a separate function
 * rather than something `apply` does unconditionally.
 */
export function checkStateInvariants(state: EditorState): StateInvariantProblem[] {
  const problems: StateInvariantProblem[] = [];

  checkDocumentInvariant(state, problems);
  checkSelectionInvariant(state, problems);
  checkPluginInvariant(state, problems);
  checkTransactionInvariant(state, problems);

  return problems;
}

/**
 * Turns validation errors into invariant problems.
 *
 * The schema's own vocabulary is kept in `details.problems` rather than translated: a caller that
 * wants to know *which* attribute or *which* child was wrong reads the structured error, and the
 * invariant only has to say that the document is not what the schema allows.
 */
export function documentProblems(doc: Node, schema: Schema): StateInvariantProblem[] {
  const problems: ValidationError[] = checkDocument(doc, schema);

  if (problems.length === 0) {
    return [];
  }

  return [
    {
      code: 'DOCUMENT_INVALID',
      details: { problems, topNode: schema.topNodeType.name },
      message: `Document does not satisfy its schema: ${problems[0]!.message}`,
    },
  ];
}

/** Whether `state` breaks no invariant; the boolean form of {@link checkStateInvariants}. */
export function isValidState(state: EditorState): boolean {
  return checkStateInvariants(state).length === 0;
}

/** The document has to satisfy the schema, and the schema has to be the one the state names. */
function checkDocumentInvariant(state: EditorState, problems: StateInvariantProblem[]): void {
  if (state.doc.type.owner !== state.schema) {
    problems.push({
      code: 'WRONG_SCHEMA',
      details: { actual: state.doc.type.name, expected: state.schema.topNodeType.name },
      message: 'Document belongs to a different schema than the state does',
    });

    return;
  }

  problems.push(...documentProblems(state.doc, state.schema));
}

/**
 * Every registered plugin has to have a slot, whether or not it carries state.
 *
 * A slot belongs to a plugin *instance*, so two plugins sharing a key keep two independent
 * states. Reading one of those states by key can only answer for one of them, which is why
 * the second registration is reported instead of quietly resolving to the first: a host that
 * registers the same key twice would otherwise read one plugin's state and believe it was
 * the other's.
 */
function checkPluginInvariant(state: EditorState, problems: StateInvariantProblem[]): void {
  for (const plugin of state.plugins) {
    if (!state.store.has(plugin.key)) {
      problems.push({
        code: 'PLUGIN_STATE_MISSING',
        details: { plugin: plugin.key.name },
        message: `Plugin "${plugin.key.name}" has no state slot in this editor state`,
      });
    }

    if (state.store.hasDuplicateKey(plugin)) {
      problems.push({
        code: 'DUPLICATE_PLUGIN_KEY',
        details: { plugin: plugin.key.name },
        message: `Two plugins are registered under the key "${plugin.key.name}"; reading that key answers for the first one only, so give each plugin its own key`,
      });
    }
  }
}

/** The selection has to sit inside the document and resolve to real positions. */
function checkSelectionInvariant(state: EditorState, problems: StateInvariantProblem[]): void {
  const size = state.doc.content.size;
  const { anchor, from, head, to } = state.selection;

  for (const [name, pos] of [
    ['anchor', anchor],
    ['head', head],
  ] as const) {
    if (!Number.isInteger(pos) || pos < 0 || pos > size) {
      problems.push({
        code: 'SELECTION_OUT_OF_RANGE',
        details: { end: name, position: pos, size },
        message: `Selection ${name} is ${pos}, which is outside a document of size ${size}`,
      });
    }
  }

  if (problems.length > 0) {
    return;
  }

  for (const [name, range] of [
    ['from', from],
    ['to', to],
  ] as const) {
    try {
      state.doc.resolve(range);
    } catch (error) {
      problems.push({
        code: 'SELECTION_UNRESOLVABLE',
        details: { end: name, position: range },
        message: `Selection ${name} does not resolve: ${(error as Error).message}`,
      });
    }
  }
}

/** A state that came from a transaction has to agree with it about the document. */
function checkTransactionInvariant(state: EditorState, problems: StateInvariantProblem[]): void {
  const transaction: null | Transaction = state.transaction;

  if (transaction && transaction.doc !== state.doc) {
    problems.push({
      code: 'STALE_TRANSACTION',
      details: { steps: transaction.steps.length },
      message: 'Editor state does not hold the document of the transaction that produced it',
    });
  }
}
