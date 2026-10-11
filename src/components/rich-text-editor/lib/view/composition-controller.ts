import type { Editor } from '../editor.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { Transaction } from '../state/transaction.ts';
import type { DOMElement } from './dom-types.ts';

import { CompositionManager } from './composition.ts';

/**
 * An input method composition, from the browser's point of view.
 *
 * {@link CompositionManager} holds what a composition *is* — the range and the provisional text —
 * and is pure: it takes a state and returns a transaction. What it cannot hold is the part that
 * belongs to the browser: whether `input`, `beforeinput` and `selectionchange` events should be
 * ignored right now, and what to do when a composition ends with provisional text still in the
 * element. That is this class, so `EditorView` can ask one object "is a composition running?"
 * instead of checking a flag, a manager and a piece of DOM state in three places:
 *
 * ```ts
 * composition.start(state);            // compositionstart
 * composition.update('ni');            // compositionupdate
 * composition.finish(state, '你');     // compositionend → one transaction, or null
 * composition.isActive;                // whether input events are the browser's business now
 * ```
 */
export class CompositionController {
  /** Whether a composition is running, as far as the view is concerned. */
  get isActive(): boolean {
    return this.active;
  }

  /** The composition as it currently stands, for a caller that needs the range. */
  get state() {
    return this.manager.current;
  }

  /** Text the browser is showing while the composition runs. */
  get text(): string {
    return this.manager.text;
  }

  private active = false;

  private readonly manager = new CompositionManager();

  /** Abandons a composition, leaving the document alone. */
  cancel(): void {
    this.active = false;
    this.manager.cancel();
  }

  /**
   * Ends the composition and returns the edit that commits its text.
   *
   * The commit becomes one transaction over the range the composition started at, so provisional
   * text the browser left in the element is replaced in one step and the composition is one undo
   * step.
   */
  finish(state: EditorState, text: string): null | Transaction {
    this.active = false;
    this.manager.update(text);

    return this.manager.finish(state, text);
  }

  /** Starts a composition at the current selection. */
  start(state: EditorState): void {
    this.active = true;
    this.manager.start(state);
  }

  /** Records the provisional text the browser is showing. */
  update(text: string): void {
    this.manager.update(text);
  }
}

/**
 * Whether a composition left provisional text behind in the element.
 *
 * Some engines insert provisional text into the editable element themselves, by mutating the DOM
 * rather than by asking the editor to, and do not always take it back: an abandoned input method, a
 * composition that ends without committing or a candidate the document refuses all leave characters
 * behind that never became document content. This compares the element with the document instead of
 * tracking what was written, because only the drift matters — and it compares block structure as
 * well as characters, since an engine can leave the text equal while the markup is not (Firefox
 * adds a `<br>` while a line is being composed).
 *
 * The name is the contract: this is a *drift* check for text and block topology, not a model/DOM
 * consistency check. A mark or attribute that renders differently while the text stays the same is
 * invisible to it, and a schema is free to render the same text in more than one way. Because the
 * render depends only on text and blocks, a full re-render is the right response to a positive
 * answer; anything finer would have to compare fingerprints.
 */
export function showsTextTheDocumentDoesNot(editor: Editor, dom: DOMElement): boolean {
  const doc = editor.state.doc;

  if (dom.textContent !== doc.textContent) {
    return true;
  }

  return dom.childNodes.length !== doc.childCount;
}
