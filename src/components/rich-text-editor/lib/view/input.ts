import type { Node as DocNode } from '../model/node.ts';
import type { Schema } from '../schema/schema.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { Transaction } from '../state/transaction.ts';
import type { DOMRules } from './dom-rules.ts';

import { chainCommands } from '../command/command.ts';
import {
  createParagraphNear,
  deleteBackward,
  deleteForward,
  deleteSelection,
  joinBackward,
  joinForward,
  splitBlock,
} from '../transform-commands/basic-editing.ts';
import { parseDOMElement } from './dom-parser.ts';

/** What the view knows about an input event, however the browser spells it. */
export interface InputLike {
  /** Text the browser is about to insert, for the `insert*` input types. */
  data?: null | string;
  /** `beforeinput`/`input` type, e.g. `insertText` or `deleteContentBackward`. */
  inputType?: string;
}

/** What the input handler decided to do. */
export interface InputResult {
  /** Whether the view handled the event and stopped the browser from acting. */
  handled: boolean;
  /** Transaction to apply, when the event produced an edit. */
  transaction?: Transaction;
}

/** Input types that insert text the editor puts into the document itself. */
const INSERT_TYPES = new Set(['insertReplacementText', 'insertText']);

/** Deletion commands, chained the same way the keymap chains them. */
const DELETE_BACKWARD = chainCommands(deleteSelection(), deleteBackward(), joinBackward());
const DELETE_FORWARD = chainCommands(deleteSelection(), deleteForward(), joinForward());

/** Block breaks use the same atom-edge fallback as the Enter keymap. */
const BREAK_BLOCK = chainCommands(createParagraphNear(), splitBlock());

/** Input types that delete backwards. */
const BACKWARD_TYPES = new Set([
  'deleteByCut',
  'deleteContentBackward',
  'deleteSoftLineBackward',
  'deleteWordBackward',
]);

/** Input types that delete forwards. */
const FORWARD_TYPES = new Set(['deleteContent', 'deleteContentForward', 'deleteHardLineForward']);

/**
 * Turns browser input events into transactions.
 *
 * Text is inserted by the editor rather than by the browser, so the document stays the only source
 * of truth and the browser's own mutation never has to be reconciled afterwards; deletions go
 * through exactly the commands a Backspace or Delete key would run, which is why an input event and
 * a key event cannot drift apart.
 */
export class InputHandler {
  /**
   * Handles a `beforeinput` event.
   *
   * Returns `handled: false` for anything the editor does not claim, which lets the browser act and
   * the view read the resulting DOM change back afterwards.
   */
  beforeInput(state: EditorState, event: InputLike): InputResult {
    const inputType = event.inputType ?? '';

    if (inputType === 'insertParagraph' || inputType === 'insertLineBreak') {
      return runCommand(state, BREAK_BLOCK, 'split');
    }

    if (INSERT_TYPES.has(inputType)) {
      const text = event.data ?? '';

      // A newline arrives through one of the block-break input types above; an empty payload
      // changes nothing.
      if (text.length === 0 || text.includes('\n')) {
        return { handled: false };
      }

      return runCommand(
        state,
        (current, dispatch) => {
          const tr = current.tr.replaceSelectionWith(text);

          if (!tr.docChanged) {
            return false;
          }

          dispatch?.(tr);

          return true;
        },
        'typing',
      );
    }

    if (BACKWARD_TYPES.has(inputType)) {
      return runCommand(state, DELETE_BACKWARD, 'delete');
    }

    if (FORWARD_TYPES.has(inputType)) {
      return runCommand(state, DELETE_FORWARD, 'delete');
    }

    return { handled: false };
  }
}

/** Parses one block element into a node, for reading browser-made changes back. */
export function blockParser(
  schema: Schema,
  rules: DOMRules,
): (element: HTMLElement) => DocNode | null {
  return (element) => {
    const fragment = parseDOMElement(element, schema, rules);
    const first = fragment.maybeChild(0);

    return first && first.isBlock ? first : null;
  };
}

/**
 * Reads a DOM change the editor did not make into a transaction.
 *
 * Pasting through the browser's own menu, drag and drop, autocorrect and anything else the editor
 * does not intercept leave the DOM out of step with the document. The block the browser touched is
 * parsed back and, when it differs, replaced in one step — which keeps `DOM → JSON` correct without
 * ever letting the DOM become the source of truth.
 *
 * @param state - state the DOM was rendered from
 * @param root - the editable root
 * @param domNode - the element the browser changed
 * @param parseBlock - parses an element into the block node it holds
 */
export function readDOMChange(
  state: EditorState,
  root: HTMLElement,
  domNode: HTMLElement,
  parseBlock: (element: HTMLElement) => DocNode | null,
): null | Transaction {
  const found = blockAt(state, root, domNode);

  if (!found) {
    return null;
  }

  const parsed = parseBlock(found.element);

  if (!parsed || parsed.eq(found.node)) {
    return null;
  }

  const tr = state.tr.replaceWith(found.start, found.start + found.node.nodeSize, parsed);

  if (!tr.docChanged) {
    return null;
  }

  tr.setMeta('historyGroup', 'input');
  tr.setMeta('observedDOMChange', true);

  return tr;
}

/** The top level block a DOM node belongs to, with its document position. */
function blockAt(
  state: EditorState,
  root: HTMLElement,
  domNode: HTMLElement,
): { element: HTMLElement; node: DocNode; start: number } | null {
  let element: HTMLElement | null = domNode;

  while (element && element.parentElement !== root) {
    element = element.parentElement;
  }

  if (!element || element.parentElement !== root) {
    return null;
  }

  let position = 0;

  for (let index = 0; index < state.doc.childCount; index++) {
    const node = state.doc.child(index);

    if (root.children[index] === element) {
      return { element, node, start: position };
    }

    position += node.nodeSize;
  }

  return null;
}

/** Runs a command and hands back the transaction it built, if any. */
function runCommand(
  state: EditorState,
  command: (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean,
  group: string,
): InputResult {
  let captured: null | Transaction = null;

  command(state, (tr) => {
    captured = tr;
  });

  if (!captured) {
    return { handled: false };
  }

  (captured as Transaction).setMeta('historyGroup', group);

  return { handled: true, transaction: captured };
}
