import type { EditorState } from '../state/editor-state.ts';
import type { Transaction } from '../state/transaction.ts';

import { TextSelection } from '../selection/text-selection.ts';

/**
 * State of an in-flight input method composition.
 *
 * CJK input goes through `compositionstart` / `compositionupdate` / `compositionend` while the
 * browser shows provisional text: the view keeps that text in the DOM and commits it as one
 * document change when the composition ends, which holds the caret still and keeps a pinyin
 * sequence to a single undo step (design §43).
 */
export interface CompositionState {
  /** Whether a composition is running. */
  active: boolean;
  /** Position the composition started at. */
  from: number;
  /** Text the browser is showing, as of the last update. */
  text: string;
  /** Position the composition currently ends at. */
  to: number;
}

/** The idle composition state. */
export const IDLE_COMPOSITION: CompositionState = { active: false, from: 0, text: '', to: 0 };

/**
 * Tracks a composition and turns it into a single edit.
 *
 * ```ts
 * const manager = new CompositionManager();
 * manager.start(state);
 * manager.update('ni');
 * const tr = manager.finish(state, '你');
 * ```
 */
export class CompositionManager {
  /** Whether a composition is currently running. */
  get active(): boolean {
    return this.state.active;
  }

  /** The composition as it currently stands. */
  get current(): CompositionState {
    return this.state;
  }

  /** Text the browser is showing while composing. */
  get text(): string {
    return this.state.text;
  }

  private state: CompositionState = IDLE_COMPOSITION;

  /** Abandons a composition without changing the document. */
  cancel(): void {
    this.state = IDLE_COMPOSITION;
  }

  /**
   * Ends the composition and returns the edit that commits its text.
   *
   * The replacement covers the range the composition started at, so provisional text the browser
   * left in the DOM is replaced in one step and the composition is one undo step.
   */
  finish(state: EditorState, text: string): null | Transaction {
    const started = this.state.active;
    const { from, to } = this.state;

    this.state = IDLE_COMPOSITION;

    if (!started) {
      return null;
    }

    const tr = state.tr.replaceWith(from, Math.min(to, state.doc.content.size), text);

    if (!tr.docChanged) {
      return null;
    }

    tr.setSelection(TextSelection.near(tr.doc, from + text.length, 1));
    tr.setMeta('historyGroup', 'composition');

    return tr;
  }

  /** Starts a composition at the current selection. */
  start(state: EditorState): CompositionState {
    const { from, to } = state.selection;

    this.state = { active: true, from, text: '', to };

    return this.state;
  }

  /** Records the provisional text the browser is showing. */
  update(text: string): CompositionState {
    if (this.state.active) {
      this.state = { ...this.state, text };
    }

    return this.state;
  }
}
