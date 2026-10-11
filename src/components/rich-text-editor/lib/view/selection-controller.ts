import type { Node as DocNode } from '../model/node.ts';
import type { Selection } from '../selection/selection.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { ViewMaps } from './dom-renderer.ts';
import type { DOMElement, DOMNode } from './dom-types.ts';

import { selectionKey } from './dom-helpers.ts';
import { domAtPos, posAtDom, readSelection, writeSelection } from './position.ts';

/**
 * The bridge between the model's selection and the browser's.
 *
 * A view has to answer two questions that look like each other and are not: *where does the model
 * say the caret is* (a position it owns) and *where is the browser's caret right now* (a DOM range
 * the browser owns). Keeping them in step is the most delicate part of a rich text editor, and
 * every bug in it looks the same from outside — "the caret jumps".
 *
 * Two hard cases. A write that has to wait, because an arrow key, Home or End moves the caret
 * *after* the `keydown` listeners return: {@link SelectionController.holdForBrowserDefault} holds
 * it and {@link SelectionController.release} settles it, writing only if the browser did *not* move
 * the caret — writing the older position turns a deferred write into typing at the wrong place. And
 * a selection the view wrote itself, which the browser reports back through `selectionchange`
 * exactly as it reports one the user made: a browser only knows ranges of characters, so reading a
 * `NodeSelection` back would replace it with the text position at the node's edge. Remembering what
 * was written tells the two apart.
 *
 * @example
 * ```ts
 * selection.holdForBrowserDefault(state);       // a key may move the caret after this returns
 * selection.release(selection.read(state.doc)); // settle it once the browser is done
 * ```
 */
export class SelectionController {
  /** Whether a write is held back for the browser. */
  get isWaiting(): boolean {
    return this.waiting;
  }

  private readonly document: Document;

  private readonly maps: ViewMaps;

  /** State whose selection is waiting to be written. */
  private pending: EditorState | null = null;

  /** The editable root, which the position bridge resolves against. */
  private readonly root: () => DOMElement;

  /** Whether a selection write is waiting for the browser's default action. */
  private waiting = false;

  /** Identity of the selection the view itself wrote last, or `null`. */
  private written: null | string = null;

  constructor(maps: ViewMaps, document: Document, root: () => DOMElement) {
    this.maps = maps;
    this.document = document;
    this.root = root;
  }

  /**
   * Drops a write that was waiting for the browser's default action.
   *
   * A state that reached the DOM through a render or a selection change has already placed the
   * caret, and a write built from an older state would drag it back — most visibly after the
   * document is replaced, where the pending write describes a document nothing shows any more.
   */
  cancel(): void {
    this.waiting = false;
    this.pending = null;
  }

  /** DOM position of a document position, or `null`. */
  domAtPos(doc: DocNode, pos: number): { node: DOMNode; offset: number } | null {
    return domAtPos(this.maps, doc, pos);
  }

  /** DOM node the browser's selection sits at. */
  focusNode(fallback: DOMNode): DOMNode {
    const node = this.document.getSelection()?.focusNode;

    if (node && node.nodeType === 3) {
      return node.parentNode ?? fallback;
    }

    return node ?? fallback;
  }

  /** Forgets what was written, so the next browser report reads as a user action. */
  forgetWritten(): void {
    this.written = null;
  }

  /**
   * Holds the next write, because the browser is about to move the caret itself.
   *
   * The state is remembered so {@link SelectionController.release} can write *it* rather than
   * whatever the state has become by then: the release runs after the browser's default action,
   * when a transaction may already have replaced the state.
   */
  holdForBrowserDefault(state: EditorState): void {
    this.waiting = true;
    this.pending = state;
  }

  /** Position of a DOM position inside this view, or `null`. */
  posAtDOM(dom: DOMNode, offset: number): null | number {
    return posAtDom(this.maps, this.root(), dom, offset);
  }

  /** The browser's own selection, read through the position bridge. */
  read(doc: DocNode): null | Selection {
    return readSelection(this.maps, this.root(), doc, this.document.getSelection());
  }

  /**
   * Settles a held write, once the browser's default action has been applied.
   *
   * The write is needed only when the browser did *not* move the caret: at the edge of a line, or
   * on a platform without that motion. When it moved, writing the older position drags the caret
   * back, turning a deferred write into typing at the wrong place.
   *
   * Whether it moved is read from the DOM, not from the editor state, and the two are not the same
   * question: the browser's caret reaches the state through `selectionchange`, queued as a separate
   * task, so it can land *after* this runs and the state still holds the position the write was
   * built from. Comparing the state with itself would always say "nothing moved" — the bug this
   * keeps away.
   *
   * @param live - the browser's own selection, read after the default action @returns whether a
   * selection was written
   */
  release(live: null | Selection): boolean {
    const pending = this.pending;

    this.waiting = false;
    this.pending = null;

    if (!pending) {
      return false;
    }

    if (live && !live.eq(pending.selection)) {
      return false;
    }

    return this.writePending(pending);
  }

  /**
   * Writes a state's selection into the browser's selection.
   *
   * @returns whether the browser's selection actually changed
   */
  write(state: EditorState): boolean {
    if (this.waiting) {
      this.pending = state;

      return false;
    }

    return this.writePending(state);
  }

  /** Whether `selection` is the one the view itself wrote last. */
  wrote(selection: globalThis.Selection | null): boolean {
    return this.written !== null && selectionKey(selection) === this.written;
  }

  /** Writes through, recording the identity of what the browser ends up holding. */
  private writePending(state: EditorState): boolean {
    const selection = state.selection;
    const written = writeSelection(
      this.maps,
      state.doc,
      selection,
      this.document.getSelection(),
      this.document,
    );

    // The browser reports the view's own write as a change of its own, exactly as it reports one
    // the user made; remembering what was written tells the two apart.
    this.written = written ? selectionKey(this.document.getSelection()) : null;

    return written;
  }
}
