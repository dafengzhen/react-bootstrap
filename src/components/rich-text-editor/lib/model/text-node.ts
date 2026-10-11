import type { Attrs } from '../util/object.ts';
import type { Mark } from './mark.ts';
import type { NodeType } from './node-type.ts';
import type { NodeJSON } from './node.ts';

import { ErrorCode, schemaError } from '../util/errors.ts';
import { EMPTY_ATTRS, freezeAttrs } from '../util/object.ts';
import { Fragment as FragmentClass } from './fragment.ts';
import { markSetEqual, normalizeMarkSet } from './mark.ts';
import { Node } from './node.ts';

/**
 * Character data with a mark set.
 *
 * Text nodes are leaves, always inline and never have content; their marks are kept in a
 * canonical, de-duplicated order so equality stays predictable.
 */
export class TextNode extends Node {
  /** Frozen, de-duplicated mark set. */
  readonly marks: readonly Mark[];

  /** The text itself. */
  readonly text: string;

  override get isInline(): boolean {
    return true;
  }

  override get isLeaf(): boolean {
    return true;
  }

  override get isText(): boolean {
    return true;
  }

  /** @inheritdoc */
  override get markSet(): readonly Mark[] {
    return this.marks;
  }

  /** @inheritdoc */
  override get rawText(): string {
    return this.text;
  }

  /** Text nodes have no children, so their text is their whole content. */
  override get textContent(): string {
    return this.text;
  }

  protected override get textLength(): number {
    return this.text.length;
  }

  constructor(type: NodeType, text: string, marks: readonly Mark[] = []) {
    super(type, EMPTY_ATTRS, FragmentClass.empty);
    this.text = text;
    this.marks = normalizeMarkSet(marks);
  }

  /** Text node with `mark` added to the set. */
  addMark(mark: Mark): TextNode {
    return this.withMarks([...this.marks, mark]);
  }

  override copy(): TextNode {
    return this;
  }

  /** Returns itself when the range is the whole text, else a node with the sliced text. */
  override cut(from: number, to: number = this.text.length): TextNode {
    if (from === 0 && to === this.text.length) {
      return this;
    }

    return this.withText(this.text.slice(from, to));
  }

  /** @inheritdoc */
  override eq(other: Node | null | undefined): boolean {
    if (!other) {
      return false;
    }

    return (
      this === other ||
      (other.isText &&
        this.type === other.type &&
        this.text === other.rawText &&
        markSetEqual(this.marks, other.markSet))
    );
  }

  /** Whether the mark set contains a mark of `type`. */
  hasMark(type: string): boolean {
    return this.marks.some((mark) => mark.type.name === type);
  }

  /** Concatenates two adjacent text nodes when their markup matches. */
  override join(other: Node): Node {
    if (!other.isText || !this.sameMarkup(other)) {
      return this;
    }

    return this.withText(this.text + other.rawText);
  }

  /** Applies `f` to the text and returns a new node when the result differs. */
  mapText(f: (text: string) => string): TextNode {
    return this.withText(f(this.text));
  }

  /** First mark of the given type, if any. */
  mark(type: string): Mark | undefined {
    return this.marks.find((mark) => mark.type.name === type);
  }

  /** Text node with `mark` removed from the set. */
  removeMark(mark: Mark): TextNode {
    return this.withMarks(this.marks.filter((existing) => !existing.eq(mark)));
  }

  /** @inheritdoc */
  override sameMarkup(other: Node): boolean {
    if (this === other) {
      return true;
    }

    return other.isText && this.type === other.type && markSetEqual(this.marks, other.markSet);
  }

  override toJSON(): NodeJSON {
    const json: NodeJSON = { text: this.text, type: this.type.name };

    if (this.marks.length > 0) {
      json.marks = this.marks.map((mark) => mark.toJSON());
    }

    return json;
  }

  override toString(): string {
    return JSON.stringify(this.text);
  }

  override withAttrs(_attrs: Attrs): Node {
    throw schemaError(ErrorCode.TEXT_NODE_WITH_ATTRIBUTES, 'Text nodes do not support attributes');
  }

  /** Text node with additional marks applied. */
  withMarks(marks: readonly Mark[]): TextNode {
    return new TextNode(this.type, this.text, marks);
  }

  /** Text node with all marks removed. */
  withoutMarks(): TextNode {
    return this.marks.length === 0 ? this : new TextNode(this.type, this.text);
  }

  /** Text node with every mark of `type` removed. */
  withoutMarkType(type: string): TextNode {
    return this.withMarks(this.marks.filter((mark) => mark.type.name !== type));
  }

  /** Text node with different text but the same marks. */
  withText(text: string): TextNode {
    return text === this.text ? this : new TextNode(this.type, text, this.marks);
  }
}

/** Type guard for text nodes. */
export function isTextNode(node: Node | null | undefined): node is TextNode {
  return !!node && node.isText;
}

/** Attribute bag of a text node is always empty. */
export const TEXT_NODE_ATTRS = freezeAttrs(EMPTY_ATTRS);
