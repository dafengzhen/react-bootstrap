import type { Editor } from '../editor.ts';
import type { Node as DocNode } from '../model/node.ts';
import type { Selection } from '../selection/selection.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { TransactionKind } from '../state/plugin.ts';
import type { Transaction } from '../state/transaction.ts';
import type { DecorationSet } from './decoration.ts';
import type { ViewMaps } from './dom-renderer.ts';
import type { DOMRules } from './dom-rules.ts';
import type { DOMElement, DOMNode } from './dom-types.ts';
import type { EditorLocale, ResolvedEditorLocale } from './locale.ts';
import type { NodeView, NodeViewRegistry } from './node-view.ts';

import { NodeSelection } from '../selection/node-selection.ts';
import { TextSelection } from '../selection/text-selection.ts';
import { ClipboardManager } from './clipboard.ts';
import { CompositionController, showsTextTheDocumentDoesNot } from './composition-controller.ts';
import { CompositionManager } from './composition.ts';
import {
  dragPayload,
  fileMarkup,
  keyEventLike,
  readClipboard,
  resolveElement,
  writeClipboard,
} from './dom-helpers.ts';
import { changedRange, mirrorsBlocks, replacedBlocks } from './dom-reconcile.ts';
import { createViewMaps, renderContent, renderDocumentRoot, renderNode } from './dom-renderer.ts';
import { defaultDOMRules, rulesForSchema } from './dom-rules.ts';
import { blockParser, InputHandler, readDOMChange } from './input.ts';
import { resolveLocale } from './locale.ts';
import { NodeViewHost } from './node-view-host.ts';
import { ObjectUrlRegistry } from './object-url.ts';
import { SelectionController } from './selection-controller.ts';
import { ViewListeners } from './view-listeners.ts';

/** Options of an {@link EditorView}. */
export interface EditorViewOptions {
  /** Element to mount into, or a selector for one. */
  element?: DOMElement | string;
  /**
   * Copy the view writes into the DOM. The editor carries no translation system and no hardcoded UI
   * text: every string the view puts in the document comes from here, see `src/view/locale.ts`.
   */
  locale?: EditorLocale;
  /** Node views an extension registered, by node name. */
  nodeViews?: NodeViewRegistry;
  /** DOM rules to render with; the defaults cover the starter kit. */
  rules?: DOMRules;
}

/**
 * A drag event as Firefox reports it.
 *
 * Firefox tells a drop target where the pointer is through these two fields rather than through a
 * caret position, and they are not part of the `DragEvent` interface.
 */
interface DragWithRange extends DragEvent {
  /** Offset inside the node the pointer is over. */
  rangeOffset?: number;
  /** Node the pointer is over, in Firefox. */
  rangeParent?: DOMNode;
}

/**
 * A document that may or may not answer WebKit's older caret query: `caretRangeFromPoint` is
 * declared as always present by the DOM types, but WebKit is the only engine that implements it, so
 * whether it is there has to be checked.
 */
interface PointDocument {
  /** WebKit's version of `caretPositionFromPoint`. */
  caretRangeFromPoint?: (x: number, y: number) => null | Range;
}

/**
 * Renders an editor into the DOM and keeps the two in step (design §2).
 *
 * The view is the only place in the project that knows about the browser: it renders the document,
 * mirrors the selection both ways, turns key, input, composition and clipboard events into
 * transactions, and reads back changes the browser made on its own. The document is never derived
 * from the DOM — a DOM change becomes a transaction that produces the DOM.
 */
export class EditorView {
  /** Clipboard reading and writing. */
  readonly clipboard: ClipboardManager;

  /**
   * The composition in flight, and the view's answer to "is one running?".
   *
   * @deprecated Read {@link EditorView.compositionController} instead.
   */
  readonly composition = new CompositionManager();

  /** Decorations to render, when any. */
  decorations: DecorationSet | undefined;

  /** Editable root the document is rendered into. */
  readonly dom: DOMElement;

  /** The editor this view renders. */
  readonly editor: Editor;

  /** Turns input events into transactions. */
  readonly inputHandler = new InputHandler();

  /** Identity maps between the document and the DOM. */
  readonly maps: ViewMaps = createViewMaps();

  /** Node views by node name. */
  readonly nodeViews: NodeViewRegistry;

  /** Whether an input method composition is running. */
  get isComposing(): boolean {
    return this.compositionController.isActive;
  }

  /** Whether the view has been destroyed. */
  get isDestroyed(): boolean {
    return this.destroyed;
  }

  /** The input method composition in flight, if any. */
  private readonly compositionController = new CompositionController();

  private destroyed = false;

  private readonly document: Document;

  private readonly domRules: DOMRules;

  private editable: boolean;
  private readonly host: DOMElement;
  /**
   * The elements this view listens on, and the only thing that unbinds them.
   *
   * @internal
   */
  private readonly listeners = new ViewListeners();
  private readonly locale: ResolvedEditorLocale;
  /** Node views mounted right now, reconciled after every render. */
  private readonly nodeViewHost: NodeViewHost;
  /**
   * Object URLs the view created for dropped or pasted files; every preview is released when the
   * node view that showed it is destroyed, or when the whole view is. See {@link
   * ObjectUrlRegistry}.
   */
  private readonly objectUrls = new ObjectUrlRegistry();

  private renderedDoc: DocNode;

  /** Reads and writes the browser's selection; knows when a write must wait. */
  private readonly selectionController: SelectionController;

  constructor(editor: Editor, options: EditorViewOptions = {}) {
    const host = resolveElement(options.element);

    this.editor = editor;
    this.host = host;
    this.document = host.ownerDocument;
    this.editable = editor.isEditable;
    this.locale = resolveLocale(options.locale);
    this.nodeViews = options.nodeViews ?? {};
    this.nodeViewHost = new NodeViewHost(this.nodeViews, () => ({
      document: this.document,
      view: this,
    }));
    this.selectionController = new SelectionController(this.maps, this.document, () => this.dom);
    this.domRules = rulesForSchema(editor.schema, options.rules ?? defaultDOMRules());
    this.clipboard = new ClipboardManager({
      document: this.document,
      rules: this.domRules,
      schema: editor.schema,
    });
    this.renderedDoc = editor.state.doc;
    this.dom = renderDocumentRoot(this.renderedDoc, this.renderContext(), {
      editable: this.editable,
      locale: this.locale,
    });
    this.mount();
    this.bindEvents();
    this.writeSelection(editor.state);

    // A view built here registers itself, so the editor renders into it even though the core never
    // imports the DOM half.
    editor.attach(this);
  }

  /** Removes focus from the editable element. */
  blur(): void {
    this.host.blur();
  }

  /**
   * Cancels a selection write that was waiting for the browser's default action: a state that
   * reached the DOM has already placed the caret, and an older write would drag it back — most
   * visibly after the document is replaced.
   */
  cancelPendingSelection(): void {
    this.selectionController.cancel();
  }

  /** Destroys the view and detaches every listener. */
  destroy(): void {
    this.listeners.destroy();
    this.editor.detach(this);

    // A node view may hold an object URL, so the URLs go after the views that used them: releasing
    // first would revoke a URL still on screen, releasing never would pin a dropped file.
    this.nodeViewHost.destroyAll();
    this.objectUrls.revokeAll();
    this.destroyed = true;
    this.dom.remove();
  }

  /** The DOM position of a document position, or `null`. */
  domAtPos(pos: number): { node: DOMNode; offset: number } | null {
    return this.selectionController.domAtPos(this.editor.state.doc, pos);
  }

  /** Focuses the editable element and moves the browser's selection in. */
  focus(): void {
    this.dom.focus();
    this.writeSelection();
  }

  /** The document position of a DOM position in this view, or `null`. */
  posAtDOM(dom: DOMNode, offset: number): null | number {
    return this.selectionController.posAtDOM(dom, offset);
  }

  /**
   * The browser's own selection, read through the position bridge — the mirror of {@link
   * EditorView.writeSelection}, for a caller that wants the caret's real place rather than where
   * the state thinks it is.
   */
  readSelection(): null | Selection {
    return this.selectionController.read(this.editor.state.doc);
  }

  /** Renders the whole document again. */
  renderAll(state: EditorState = this.editor.state): void {
    while (this.dom.firstChild) {
      this.dom.firstChild.remove();
    }

    this.rememberRoot(state.doc);
    this.nodeViewHost.beginRender();
    renderContent(this.dom, state.doc, this.renderContext(), 0);
    this.renderedDoc = state.doc;
    this.syncPlaceholder(state.doc);

    // Every block was just rebuilt, so a node view the render did not ask for is no longer on
    // screen.
    this.nodeViewHost.endRender();
  }

  /** Turns editing on or off, and announces it. */
  setEditable(editable: boolean): void {
    this.editable = editable;
    this.dom.setAttribute('contenteditable', editable ? 'true' : 'false');

    // A screen reader reads the read-only state from the ARIA attribute, not from the rendering
    // state; it has to be removed again when editing comes back.
    if (editable) {
      this.dom.removeAttribute('aria-readonly');
    } else {
      this.dom.setAttribute('aria-readonly', 'true');
    }
  }

  /**
   * Renders `state` into the view, rebuilding only what changed.
   *
   * The comparison is against the document the DOM was last rendered from, so a selection-only
   * transaction leaves the DOM, the browser's selection and its focus untouched. Anything else
   * reaches the DOM, including an edit the browser made.
   */
  update(state: EditorState, transaction?: Transaction): void {
    if (this.destroyed) {
      return;
    }

    const previous = this.renderedDoc;

    // A transaction is the editor's own decision about the caret, so it outranks a write waiting
    // for the browser's default action.
    if (transaction) {
      this.cancelPendingSelection();
    }

    if (previous === state.doc) {
      // A browser drag reports each intermediate range through selectionchange. Writing that
      // same range back tears down the native selection while the pointer is still moving,
      // which can stop or reverse the drag. Programmatic selection changes still need a write.
      if (!this.readSelection()?.eq(state.selection)) {
        this.writeSelection(state);
      }

      return;
    }

    if (!transaction) {
      this.renderAll(state);

      return;
    }

    const changed = changedRange(previous, state.doc);

    if (!changed) {
      this.renderedDoc = state.doc;
      this.syncPlaceholder(state.doc);
      this.writeSelection(state);

      return;
    }

    // The DOM mirrors `previous`, so the element under a document block is the one at the same
    // index; otherwise the whole document is rendered again.
    if (!mirrorsBlocks(previous, this.dom)) {
      this.renderAll(state);

      return;
    }

    // Which top level blocks to replace is decided by identity, not position: a document is
    // immutable and every edit rebuilds just the blocks it touched, so the blocks still the same
    // node are the ones the DOM already shows correctly. A position based range is wrong here —
    // `changedRange` reports where two documents differ, which says nothing about which *blocks*
    // differ: one paragraph becoming two changes at a block boundary, and a boundary position
    // belongs to both neighbours.
    const replacement = replacedBlocks(previous, state.doc);
    const removeCount = Math.min(
      replacement.oldLast - replacement.oldFirst + 1,
      this.dom.childNodes.length,
    );

    for (let drop = 0; drop < removeCount; drop++) {
      this.dom.children[replacement.oldFirst]?.remove();
    }

    const fragment = this.document.createDocumentFragment();
    let position = 0;

    for (let index = 0; index < replacement.newFirst; index++) {
      position += state.doc.child(index).nodeSize;
    }

    this.nodeViewHost.beginRender();

    for (let index = replacement.newFirst; index <= replacement.newLast; index++) {
      const node = state.doc.child(index);

      fragment.append(renderNode(node, this.renderContext(), position));
      position += node.nodeSize;
    }

    this.dom.insertBefore(fragment, this.dom.childNodes[replacement.oldFirst] ?? null);
    this.renderedDoc = state.doc;
    this.rememberRoot(state.doc);
    this.syncPlaceholder(state.doc);
    this.writeSelection(state);

    // Only replaced blocks were rendered. Keep node views in untouched blocks mounted, and
    // destroy views whose DOM was removed from the editable root.
    this.nodeViewHost.endRender(this.dom);
  }

  /**
   * Writes a state's selection into the browser's selection; a write that would follow a browser
   * default action is held back, because an arrow key, Home or End moves the caret *after* the
   * `keydown` listeners return, so the key would look broken. {@link EditorView.flushSelection}
   * settles it.
   */
  writeSelection(state: EditorState = this.editor.state): boolean {
    return this.selectionController.write(state);
  }

  /**
   * Runs `action` after the browser's default action for the current event: a microtask is too
   * early — the default action runs after the event listeners return but before the next task — so
   * the callback goes out on an animation frame, when the engine has also queued `selectionchange`.
   */
  private afterBrowserDefault(action: () => void): void {
    const view = this.document.defaultView;

    if (view && typeof view.requestAnimationFrame === 'function') {
      view.requestAnimationFrame(() => {
        if (!this.destroyed) {
          action();
        }
      });

      return;
    }

    setTimeout(() => {
      if (!this.destroyed) {
        action();
      }
    }, 0);
  }

  /** Wires the browser events the view reacts to. */
  private bindEvents(): void {
    this.on(this.host, 'mousedown', (event) => {
      let target = event.target as DOMNode | null;
      while (target && target !== this.dom && !this.maps.domToDoc.has(target)) {
        target = target.parentNode;
      }
      const node = target ? this.maps.domToDoc.get(target) : undefined;
      if (!this.editable || !target || !node?.isLeaf || !node.selectable || node.isText) {
        return;
      }
      const pos = this.posAtDOM(target, 0);

      if (pos === null) {
        return;
      }
      event.preventDefault();
      this.dom.focus();
      if (node.name === 'image') {
        const element = target as DOMElement;
        const rect = (element.querySelector('img') ?? element).getBoundingClientRect();
        const direction = (event as MouseEvent).clientY < rect.top + rect.height / 2 ? -1 : 1;
        this.placeImageCaret(pos, direction);
        return;
      }
      this.editor.dispatch(
        this.editor.state.tr.setSelection(NodeSelection.create(this.editor.state.doc, pos)),
      );
    });
    this.on(this.host, 'keydown', (event) => this.handleKeyDown(event as KeyboardEvent));
    this.on(this.host, 'beforeinput', (event) => this.handleBeforeInput(event));
    this.on(this.host, 'input', () => this.handleInput());
    this.on(this.host, 'compositionstart', () => this.handleCompositionStart());
    this.on(this.host, 'compositionupdate', (event) => this.handleCompositionUpdate(event));
    this.on(this.host, 'compositionend', (event) => this.handleCompositionEnd(event));
    this.on(this.host, 'copy', (event) => this.handleCopy(event as ClipboardEvent, false));
    this.on(this.host, 'cut', (event) => this.handleCopy(event as ClipboardEvent, true));
    this.on(this.host, 'paste', (event) => this.handlePaste(event as ClipboardEvent));
    this.on(this.host, 'drop', (event) => this.handleDrop(event as DragEvent));
    this.on(this.host, 'dragover', (event) => this.handleDragOver(event as DragEvent));
    // The browser moves its own selection on a click, on a drag or when the user presses an arrow
    // key; `selectionchange` is the one event that reports all of it.
    this.on(this.document, 'selectionchange', () => this.handleSelectionChange());
  }

  /**
   * Sends a transaction the view built to the editor, saying what the view observed: the view is
   * the only layer that knows whether an edit came from a keystroke, a paste, a composition commit
   * or the browser, so the origin is recorded here. A transaction already carrying one keeps it.
   */
  private dispatch(
    transaction: Transaction,
    origin: { command?: string; kind: TransactionKind },
  ): void {
    this.editor.dispatch(transaction.setOriginIfUnset(origin));
  }

  /**
   * Document position a drop landed on, or `undefined` when it landed outside.
   *
   * Three engines, three ways to ask where the pointer is: Firefox reports a node and an offset on
   * the drag event itself, Chromium and the standard answer `caretPositionFromPoint`, WebKit its
   * older `caretRangeFromPoint`.
   */
  private dropPosition(event: DragEvent): number | undefined {
    const types: DragWithRange = event;
    const document = this.document as Document & PointDocument;

    if (types.rangeParent) {
      const pos = this.posAtDOM(types.rangeParent, types.rangeOffset ?? 0);

      if (pos !== null) {
        return pos;
      }
    }

    const caretPositionFromPoint = this.document.caretPositionFromPoint?.bind(this.document);
    const position = caretPositionFromPoint
      ? caretPositionFromPoint(event.clientX, event.clientY)
      : null;
    const range = position
      ? null
      : (document.caretRangeFromPoint?.call(this.document, event.clientX, event.clientY) ?? null);
    const node: DOMNode | undefined = position?.offsetNode ?? range?.startContainer;
    const offset = position?.offset ?? range?.startOffset;

    if (!node || offset === undefined) {
      return undefined;
    }

    return this.posAtDOM(node, offset) ?? undefined;
  }

  /**
   * Settles the selection once the browser's default action for a key has been applied: the
   * browser's position is kept when it moved the caret, and the state's is written back when it did
   * not. That is read from the DOM, since the caret reaches the state through a `selectionchange`
   * that may still be queued — see {@link SelectionController.release}.
   */
  private flushSelection(): void {
    const state = this.editor.state;
    const live = this.selectionController.read(state.doc);

    this.selectionController.release(live);
  }

  /** Claims the input events the editor turns into transactions itself. */
  private handleBeforeInput(event: Event): void {
    if (this.compositionController.isActive || !this.editable) {
      return;
    }

    this.syncSelectionFromDOM();

    // `InputEvent` is not available everywhere, so the fields are read structurally.
    const input = {
      data: (event as Partial<InputEvent>).data,
      inputType: (event as Partial<InputEvent>).inputType,
    };
    const result = this.inputHandler.beforeInput(this.editor.state, input);

    if (result.handled && result.transaction) {
      event.preventDefault();
      this.dispatch(result.transaction, { command: input.inputType, kind: 'input' });
    }
  }

  /**
   * Commits the composed text as a single edit: the commit is dispatched first, so the view renders
   * the document with the candidate in it, and only then is the element compared with the document
   * — comparing first would throw the committed character away with the provisional text.
   */
  private handleCompositionEnd(event: Event): void {
    const text = (event as CompositionEvent).data ?? this.compositionController.text;
    const tr = this.compositionController.finish(this.editor.state, text);

    if (tr) {
      this.dispatch(tr, { kind: 'composition' });
    }

    if (showsTextTheDocumentDoesNot(this.editor, this.dom)) {
      this.renderAll();
    }

    // `selectionchange` events raised while the composition ran were ignored, so nothing has put
    // the caret back where the document says it belongs; the next keystroke would land wherever the
    // input method left it.
    this.writeSelection();
  }

  /** Starts a composition at the current selection. */
  private handleCompositionStart(): void {
    this.compositionController.start(this.editor.state);
  }

  /** Records the provisional text the input method is showing. */
  private handleCompositionUpdate(event: Event): void {
    this.compositionController.update((event as CompositionEvent).data ?? '');
  }

  /** Writes the payload for a copy, or copies and removes for a cut. */
  private handleCopy(event: ClipboardEvent, cut: boolean): void {
    this.syncSelectionFromDOM();
    const payload = this.clipboard.copy(this.editor.state);

    writeClipboard(event, payload);

    if (!cut) {
      return;
    }

    const removal = this.clipboard.cut(this.editor.state).transaction;

    if (removal) {
      this.dispatch(removal, { kind: 'paste' });
    }
  }

  /**
   * Claims a drag that carries something the editor can insert: `dragover` tells the browser
   * whether a drop target accepts the payload at all, a drop the editor cannot represent has to be
   * left to the browser, and the editor only claims what it will insert.
   */
  private handleDragOver(event: DragEvent): void {
    if (this.editable && dragPayload(event.dataTransfer).hasContent) {
      event.preventDefault();
    }
  }

  /**
   * Inserts what a drop carried, at the position it landed on: a drop can land anywhere, so the
   * place it landed decides where the content goes, not where the caret happened to be. Images
   * arrive as files or as markup and become nodes; anything else is inserted as a paste.
   */
  private async handleDrop(event: DragEvent): Promise<void> {
    if (!this.editable) {
      return;
    }

    const payload = dragPayload(event.dataTransfer);

    if (!payload.hasContent) {
      return;
    }

    event.preventDefault();

    const pos = this.dropPosition(event);

    if (await this.insertFiles(payload.files, pos)) {
      return;
    }

    // The state is read *after* the await, because reading a file is asynchronous: the editor may
    // have moved on, and a transaction built from the state the drop started in would describe a
    // document no longer there.
    const tr = this.clipboard.paste(
      this.editor.state,
      { html: payload.html, text: payload.text },
      pos === undefined ? {} : { pos },
    );

    if (tr) {
      this.dispatch(tr, { kind: 'paste' });
    }
  }

  /**
   * Notes that the browser touched the DOM: the editor inserts its own text, so an `input` event it
   * did not cause means the browser changed the DOM on its own — a paste from the menu,
   * autocorrect, a drop. The block it touched is parsed back into a transaction, so the document
   * catches up without the DOM becoming the source of truth.
   */
  private handleInput(): void {
    if (this.compositionController.isActive || !this.editable) {
      return;
    }

    const state = this.editor.state;
    const tr = readDOMChange(
      state,
      this.dom,
      this.selectionFocusNode(),
      blockParser(state.schema, this.domRules),
    );

    if (tr) {
      this.dispatch(tr, { kind: 'input' });

      return;
    }

    this.handleSelectionChange();
  }

  /**
   * Runs the editor's keymap for a key event: a key the editor does not claim is left to the
   * browser, which is what makes the arrow keys, Home, End, Page Up and the platform's own caret
   * motions work. Those defaults apply after this listener returns, so the selection write that
   * follows is held back.
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.editable || event.isComposing || this.compositionController.isActive) {
      return;
    }

    // `selectionchange` is asynchronous in browsers. A key can therefore arrive after the user
    // moved the caret but before that move reached the editor state. Read the live range at the
    // editing boundary so Enter splits the block the user is looking at, especially at heading and
    // block-atom edges where a stale position is visible as a caret jump.
    this.syncSelectionFromDOM();

    const selection = this.editor.state.selection;
    const verticalDirection =
      !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey
        ? event.key === 'ArrowUp'
          ? -1
          : event.key === 'ArrowDown'
            ? 1
            : null
        : null;
    if (verticalDirection && selection.empty && this.imageOnlyBlock(selection.head)) {
      event.preventDefault();
      this.placeImageCaret(selection.head, verticalDirection);
      return;
    }
    if (
      verticalDirection &&
      selection instanceof NodeSelection &&
      selection.node.name === 'image'
    ) {
      event.preventDefault();
      this.placeImageCaret(selection.from, verticalDirection);
      return;
    }
    if (
      selection instanceof NodeSelection &&
      selection.node.name === 'horizontal_rule' &&
      (event.key === 'End' || event.key === 'Home')
    ) {
      event.preventDefault();
      this.editor.dispatch(
        this.editor.state.tr.setSelection(
          TextSelection.create(
            this.editor.state.doc,
            event.key === 'End' ? selection.to : selection.from,
          ),
        ),
      );
      return;
    }

    if (this.editor.runKey(keyEventLike(event))) {
      this.selectionController.cancel();

      return;
    }

    this.selectionController.holdForBrowserDefault(this.editor.state);
    this.afterBrowserDefault(() => {
      this.flushSelection();
      if (verticalDirection) {
        const live = this.readSelection();
        if (live?.empty && this.imageOnlyBlock(live.head)) {
          this.placeImageCaret(live.head, verticalDirection);
        }
      }
    });
  }

  /** Inserts whatever the clipboard carried. */
  private handlePaste(event: ClipboardEvent): void {
    this.syncSelectionFromDOM();
    const payload = readClipboard(event);
    const tr = this.clipboard.paste(this.editor.state, payload);

    if (tr) {
      event.preventDefault();
      this.dispatch(tr, { kind: 'paste' });
    }
  }

  /**
   * Mirrors the browser's selection into the editor state, skipping a selection the view wrote
   * itself: a `NodeSelection` has no DOM equivalent that reads back as a node, so it would become
   * the text position at the node's edge and the next keystroke would edit text instead of the
   * node.
   */
  private handleSelectionChange(): void {
    if (this.destroyed || this.compositionController.isActive) {
      return;
    }

    const domSelection = this.document.getSelection();

    if (this.selectionController.wrote(domSelection)) {
      return;
    }

    this.selectionController.forgetWritten();

    this.syncSelectionFromDOM();
  }

  /** An image-only paragraph has no visible text caret; use its neighbouring text line instead. */
  private imageOnlyBlock(pos: number): { from: number; to: number } | null {
    const $pos = this.editor.state.doc.resolve(pos);
    for (let depth = $pos.depth; depth > 0; depth--) {
      const node = $pos.node(depth);
      if (
        node.content.children.some((child) => child.name === 'image') &&
        node.content.children.every(
          (child) => child.name === 'image' || (child.isText && !child.textContent.trim()),
        )
      ) {
        return { from: $pos.before(depth), to: $pos.after(depth) };
      }
    }
    return null;
  }

  /**
   * Inserts dropped files as media nodes: a dropped picture has no address, so it becomes a `data:`
   * URL in the markup the paste path understands, and nothing has to be uploaded for it to appear.
   * Audio and video are too large for that and become an object URL, the address of the file while
   * the page lives.
   *
   * @returns whether the drop carried media, so the payload's text flavour is not inserted too
   */
  private async insertFiles(files: readonly File[], pos: number | undefined): Promise<boolean> {
    const markup: string[] = [];

    for (const file of files) {
      const html = await fileMarkup(file, this.objectUrls);

      if (html) {
        markup.push(html);
      }
    }

    if (markup.length === 0) {
      return false;
    }

    const tr = this.clipboard.paste(
      this.editor.state,
      { html: markup.join('') },
      pos === undefined ? {} : { pos },
    );

    if (tr) {
      this.dispatch(tr, { kind: 'paste' });
    }

    return true;
  }

  /** Puts the editable root into its host element. */
  private mount(): void {
    while (this.host.firstChild) {
      this.host.firstChild.remove();
    }

    this.host.append(this.dom);
    this.syncPlaceholder(this.renderedDoc);
  }

  /** Node view of `node`, reused while it keeps its identity. */
  private nodeViewFor(node: DocNode): NodeView | null {
    return this.nodeViewHost.viewFor(node);
  }

  /** Adds a DOM listener removed again when the view is destroyed. */
  private on(target: EventTarget, type: string, listener: EventListener): void {
    this.listeners.on(target, type, (event) => {
      // Attached UI shares the scroll host, but its inputs and keyboard actions are not document edits.
      if (target === this.host && event.target && !this.dom.contains(event.target as DOMNode)) {
        return;
      }
      listener(event);
    });
  }

  private placeImageCaret(pos: number, direction: -1 | 1): void {
    const state = this.editor.state;
    const block = this.imageOnlyBlock(pos);
    if (!block) {
      const node = state.doc.nodeStartingAt(pos);
      this.selectionController.cancel();
      this.editor.dispatch(
        state.tr.setSelection(
          TextSelection.near(
            state.doc,
            pos + (direction === 1 && node?.name === 'image' ? node.nodeSize : 0),
            direction,
          ),
        ),
      );
      return;
    }
    let candidate = direction === -1 ? block.from - 1 : block.to + 1;
    while (candidate >= 0 && candidate <= state.doc.content.size) {
      const next = TextSelection.near(state.doc, candidate, direction);
      const otherImageBlock = this.imageOnlyBlock(next.head);
      if (otherImageBlock) {
        candidate = direction === -1 ? otherImageBlock.from - 1 : otherImageBlock.to + 1;
        continue;
      }
      if (next.$head.parent.contentMatch.allowedTypes.some((type) => type.isText)) {
        this.selectionController.cancel();
        this.editor.dispatch(state.tr.setSelection(next));
        return;
      }
      break;
    }
    // At the document edge, provide an actual empty line rather than a hidden caret on the atom.
    const paragraph = state.schema.nodes.paragraph;
    if (paragraph) {
      const at = direction === -1 ? block.from : block.to;
      const tr = state.tr.insert(at, [paragraph.create()]);
      tr.setSelection(TextSelection.create(tr.doc, at + 1));
      this.selectionController.cancel();
      this.editor.dispatch(tr);
    }
  }

  /**
   * Rebinds the identity map of the editable root to `doc`: the root is found by document node, and
   * a document is immutable, so the entry is rewritten after each render — otherwise the bridge
   * looks up a node nothing maps to and every position resolves to `null`.
   */
  private rememberRoot(doc: DocNode): void {
    this.maps.docToDom.set(doc, this.dom);
    this.maps.domToDoc.set(this.dom, doc);
    this.maps.contentDOM.set(doc, this.dom);
  }

  /** Builds the context the renderer works with. */
  private renderContext() {
    return {
      decorations: this.decorations,
      document: this.document,
      maps: this.maps,
      nodeView: (node: DocNode): NodeView | null => this.nodeViewFor(node),
      rules: this.domRules,
    };
  }

  /** DOM node the browser's selection sits at. */
  private selectionFocusNode(): DOMElement {
    return this.selectionController.focusNode(this.dom) as DOMElement;
  }

  /** Keeps the placeholder attribute in step with an empty document. */
  private syncPlaceholder(doc: DocNode): void {
    const placeholder = this.locale.placeholder;

    if (!placeholder) {
      return;
    }

    if (doc.textContent.length === 0) {
      this.dom.setAttribute('data-placeholder', placeholder);
    } else {
      this.dom.removeAttribute('data-placeholder');
    }
  }

  /** Mirrors the browser's current range into state before an edit depends on it. */
  private syncSelectionFromDOM(): void {
    if (this.selectionController.wrote(this.document.getSelection())) {
      return;
    }
    const selection = this.readSelection();

    if (!selection || selection.eq(this.editor.state.selection)) {
      return;
    }

    this.editor.dispatch(this.editor.state.tr.setSelection(selection));
  }
}

export {
  dragPayload,
  escapeHtml,
  fileMarkup,
  resolveElement,
  selectionKey,
} from './dom-helpers.ts';
/**
 * Re-exported so a host that imported these from the view keeps working; they moved to
 * `dom-reconcile` and `dom-helpers` when the view was split into controllers.
 */
export { changedRange, mirrorsBlocks, replacedBlocks } from './dom-reconcile.ts';
