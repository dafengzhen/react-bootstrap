import type { Mark } from '../model/mark.ts';
import type { Node as DocNode } from '../model/node.ts';
import type { TextNode } from '../model/text-node.ts';
import type { Selection } from '../selection/selection.ts';
import type { ReplaceContent } from '../transform/replace.ts';
import type { EditorState } from './editor-state.ts';
import type { TransactionOrigin } from './plugin.ts';

import { Fragment } from '../model/fragment.ts';
import { Slice as SliceClass } from '../model/slice.ts';
import { AllSelection } from '../selection/all-selection.ts';
import { TextSelection } from '../selection/text-selection.ts';
import { contentAsSlice, planReplace } from '../transform/replace.ts';
import { ReplaceStep } from '../transform/step.ts';
import { Transform } from '../transform/transform.ts';
import { isUserOrigin, USER_ORIGIN } from './plugin.ts';

/**
 * A transaction describes one state change: a `Transform` plus what only an editor state cares
 * about — the selection it should end up with, metadata plugins read, and the state it started
 * from. Everything the editor does produces one rather than touching a document directly.
 *
 * ```ts
 * const tr = state.tr.insert(1, [schema.text('hi')]);
 * const next = state.apply(tr.setSelection(TextSelection.at(tr.doc, 3)));
 * ```
 */
export class Transaction extends Transform {
  /** Metadata attached by commands and read by plugins. */
  readonly meta: Map<string, unknown> = new Map();

  /**
   * Where this transaction came from: a command sets `"command"` with
   * {@link Transaction.setOrigin}, a view sets `"input"`, `"paste"` or `"composition"` on what it
   * observed. Read this rather than inferring the source from metadata.
   */
  origin: TransactionOrigin = USER_ORIGIN;

  /** Whether `setOrigin` was called; an edit boundary sets one only when that is false. */
  originSet = false;

  /** Whether `setSelection` was called explicitly. */
  selectionSet = false;

  /** State this transaction was created from. */
  readonly state: EditorState;

  /** Mark to apply to the next typed character; `null` means "no mark". */
  storedMark: Mark | null = null;

  /** Whether `setStoredMark` was called explicitly. */
  storedMarkSet = false;

  /** Whether the transaction changed the document or the selection. */
  get changed(): boolean {
    return this.docChanged || this.selectionSet;
  }

  /** Whether the transaction changed the document. */
  get docChanged(): boolean {
    return this.steps.length > 0;
  }

  /** Whether this transaction came from a user action. */
  get isUserChange(): boolean {
    return isUserOrigin(this.origin);
  }

  /** The selection the state should have after this transaction. */
  get selection(): Selection {
    return this.currentSelection;
  }

  private currentSelection: Selection;

  /**
   * Created through `EditorState.tr`.
   *
   * @internal
   */
  constructor(state: EditorState) {
    super(state.doc);
    this.state = state;
    this.currentSelection = state.selection;
    this.storedMark = state.storedMark;
  }

  /** Copies the metadata of this transaction onto `other`. */
  static copyMeta(from: Transaction, to: Transaction): void {
    for (const [key, value] of from.meta) {
      to.meta.set(key, value);
    }
  }

  /** Reads a metadata value. */
  getMeta(key: string): unknown {
    return this.meta.get(key);
  }

  /** Whether the given metadata key is present. */
  hasMeta(key: string): boolean {
    return this.meta.has(key);
  }

  /**
   * Replaces the selection with `content` and leaves the caret after it.
   *
   * Typing calls this. It differs from {@link replaceSelectionWith} once the selection is a range:
   * here the next character goes after the one just typed, there the caret lands at a block
   * boundary — right for replacing a whole block, wrong for typing into a leftover range.
   *
   * ```ts
   * tr.setSelection(range).insertAtCaret('x'); // the range replaced by "x", the caret after it
   * ```
   */
  insertAtCaret(content: ReplaceContent): this {
    if (this.selection instanceof AllSelection) {
      // A selection of everything is not a text range: it covers the document's own boundaries,
      // which content offsets cannot express, and removing every block would leave a document the
      // schema refuses. What was typed becomes the document, in a blank editor's starting block.
      const block = this.doc.type.schema.emptyDoc().firstChild;

      if (block) {
        this.replaceWith(0, this.doc.content.size, textBlock(block, this.textOf(content)));
        this.setSelection(TextSelection.near(this.doc, 1));
      }

      return this;
    }

    // A text range is expressed in document positions already, while a node selection addresses a
    // node by the content offset of its child — `$to.pos` is the position after it.
    const end =
      this.selection instanceof TextSelection ? this.selection.to : this.selection.$to.pos;

    this.currentSelection = TextSelection.create(this.doc, end);
    this.selectionSet = true;

    return this.replaceSelectionWith(content);
  }

  /** Replaces the current selection with `content`; the cursor comes from the replace. */
  replaceSelection(content: ReplaceContent): this {
    return this.replaceWith(this.selection.from, this.selection.to, content);
  }

  /**
   * Replaces the selection and leaves the cursor after the inserted content: the caret ends up
   * after the character just inserted, and the cursor comes from the replace itself, so it is
   * correct even when the inserted content had to be wrapped.
   */
  replaceSelectionWith(content: ReplaceContent): this {
    const { from, to } = this.selection;
    const slice = this.markedSlice(
      content instanceof SliceClass ? content : contentAsSlice(this.doc.resolve(from), content),
    );
    const plan = planReplace(this.doc, from, to, slice);

    if (!plan) {
      return this;
    }

    // Applied directly rather than through `replaceWith`: the replacement was already planned,
    // and planning it again would map the cursor against a document that no longer matches.
    for (const range of plan.ranges) {
      this.step(new ReplaceStep(range.from, range.to, range.slice));
    }

    if (!this.docChanged) {
      return this;
    }

    this.setSelection(
      TextSelection.create(this.doc, Math.min(Math.max(plan.cursor, 1), this.doc.content.size)),
    );

    return this;
  }

  /**
   * Asks the editor to scroll the selection into view.
   *
   * The core is headless, so a view adapter reads the intent from the metadata.
   */
  scrollIntoView(): this {
    return this.setMeta('scrollIntoView', true);
  }

  /** Sets a metadata value. A `null` value removes the entry. */
  setMeta(key: string, value: unknown): this {
    if (value === null || value === undefined) {
      this.meta.delete(key);
    } else {
      this.meta.set(key, value);
    }

    return this;
  }

  /**
   * Records where this transaction came from: a command marks `"command"`, a view what it read
   * from the browser `"input"`, `"paste"` or `"composition"`, an undo its restore `"history"`, a
   * plugin appending a fix-up `"normalization"`. Plugins read {@link Transaction.origin}.
   *
   * ```ts
   * tr.setOrigin({ command: 'insertText', kind: 'command' });
   * ```
   */
  setOrigin(origin: TransactionOrigin): this {
    this.origin = origin;
    this.originSet = true;

    return this;
  }

  /**
   * Records where this transaction came from, unless a caller already said so.
   *
   * An edit boundary — a named command, a `beforeinput`, a paste, a composition commit — uses this,
   * because it knows what it observed and the code that built the transaction usually does not. A
   * caller that set its own origin, like undo marking its restore `"history"`, keeps it.
   *
   * ```ts
   * tr.setOriginIfUnset({ command: 'toggleBold', kind: 'command' });
   * ```
   */
  setOriginIfUnset(origin: TransactionOrigin): this {
    return this.originSet ? this : this.setOrigin(origin);
  }

  /** Sets the selection the state should end up with. */
  setSelection(selection: Selection): this {
    this.currentSelection = selection;
    this.selectionSet = true;

    return this;
  }

  /** Records the mark to apply to the next typed character. */
  setStoredMark(mark: Mark | null): this {
    this.storedMark = mark;
    this.storedMarkSet = true;

    return this;
  }

  /**
   * Sets the selection to a text range.
   *
   * @param anchor - where the selection starts
   * @param head - where it ends; defaults to `anchor`, which makes a cursor
   */
  setTextSelection(anchor: number, head: number = anchor): this {
    return this.setSelection(TextSelection.create(this.doc, anchor, head));
  }

  override toString(): string {
    return `Transaction(${this.steps.length} steps, ${this.selection.toString()})`;
  }

  /**
   * Applies the marks content typed at a cursor inherits. A collapsed selection carries no marks of
   * its own, so there are two sources: the stored mark that `toggleBold` sets wins, otherwise the
   * character before the caret decides, as in `bold|` continuing the run. That second source is
   * what `MarkSpec.inclusive` gates — typing at the end of a link has to leave the link.
   */
  private markedSlice(slice: SliceClass): SliceClass {
    if (!this.selection.empty || slice.size === 0) {
      return slice;
    }

    const marks = this.marksAtCursor();

    if (marks.length === 0) {
      return slice;
    }

    const children = slice.content.children.map((child) => {
      if (!child.isText) {
        return child;
      }

      let text = child as TextNode;

      for (const mark of marks) {
        text = text.addMark(mark) as TextNode;
      }

      return text;
    });

    return new SliceClass(Fragment.from(children), slice.openStart, slice.openEnd);
  }

  /** Marks a character typed at the caret inherits, stored mark first. */
  private marksAtCursor(): readonly Mark[] {
    const stored = this.storedMark;

    if (stored) {
      return [stored];
    }

    const inherited = this.state.doc.resolve(this.selection.from).nodeBefore();
    const candidate = inherited?.isText ? inherited.markSet : null;

    return candidate ? candidate.filter((mark) => mark.type.inclusive) : [];
  }

  /** Text of `content`, for the one case that has to build a block around it. */
  private textOf(content: ReplaceContent): string {
    return typeof content === 'string'
      ? content
      : contentAsSlice(this.doc.resolve(0), content).content.textContent;
  }
}

/** Convenience factory for tests and for code without an editor instance. */
export function createTransaction(state: EditorState): Transaction {
  return new Transaction(state);
}

/**
 * `block` with `text` as its content, in a slice a replacement can insert: used by
 * {@link Transaction.insertAtCaret} when typing builds a block rather than edits one, because a
 * document with no block is not a document. The block is a blank editor's first, so this is what
 * selecting everything and typing produces.
 */
function textBlock(block: DocNode, text: string): SliceClass {
  return new SliceClass(
    Fragment.from([block.type.create(block.attrs, text.length > 0 ? text : null)]),
    0,
    0,
  );
}
