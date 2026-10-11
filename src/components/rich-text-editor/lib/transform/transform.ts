import type { Mark } from '../model/mark.ts';
import type { NodeType } from '../model/node-type.ts';
import type { Node } from '../model/node.ts';
import type { Slice } from '../model/slice.ts';
import type { Attrs } from '../util/object.ts';
import type { ReplaceContent } from './replace.ts';
import type { Step } from './step.ts';
import type { StepJSON } from './step.ts';

import { Fragment } from '../model/fragment.ts';
import { Slice as SliceClass } from '../model/slice.ts';
import { Mapping } from './mapping.ts';
import { contentAsSlice, planReplace } from './replace.ts';
import { AddMarkStep, AttrStep, RemoveMarkStep, ReplaceStep } from './step.ts';

/**
 * A sequence of steps applied to a document.
 *
 * `Transform` is the mutation engine behind `Transaction`: it applies steps, keeps the resulting
 * document, records how positions moved and remembers the steps so history and collaboration can
 * replay or invert them.
 *
 * ```ts
 * const tr = new Transform(doc);
 * tr.insert(1, [schema.text('hi')]);
 * tr.doc;        // the new document
 * tr.steps;      // the steps that produced it
 * tr.mapping;    // how positions moved
 * ```
 */
export class Transform {
  /** Document produced by the steps applied so far. */
  doc: Node;

  /** Position mapping of all applied steps. */
  readonly mapping = new Mapping([]);

  /** Steps applied so far, in order. */
  readonly steps: Step[] = [];

  /** Whether the transform changed the document at all. */
  get changed(): boolean {
    return this.steps.length > 0;
  }

  /** Documents before each applied step, the document `invert` needs for each of them. */
  get documentsBefore(): readonly Node[] {
    return this.docs;
  }

  /** Number of steps applied so far. */
  get stepCount(): number {
    return this.steps.length;
  }

  /** Documents before each step, kept for `invert`. */
  private readonly docs: Node[] = [];

  constructor(doc: Node) {
    this.doc = doc;
  }

  /** Adds `mark` to the text between `from` and `to`. */
  addMark(from: number, to: number, mark: Mark): this {
    this.step(new AddMarkStep(from, to, mark));

    return this;
  }

  /** Whether the boundaries around `pos` can be joined. */
  canJoin(pos: number): boolean {
    return joinAt(this.doc, pos) !== null;
  }

  /** Deletes `[from, to)`. */
  delete(from: number, to: number): this {
    return this.replaceWith(from, to, SliceClass.empty);
  }

  /** Inserts `content` at `pos`. */
  insert(pos: number, content: ReplaceContent): this {
    return this.replaceWith(pos, pos, content);
  }

  /**
   * Joins the two block boundaries around `pos`.
   *
   * Backspace at the start of a block and Delete at the end both use this, which is why they keep
   * the marks and the attributes of both sides.
   */
  join(pos: number): this {
    const joined = joinAt(this.doc, pos);

    return joined ? this.replaceWith(joined.from, joined.to, joined.content) : this;
  }

  /** Removes `mark` from the text between `from` and `to`. */
  removeMark(from: number, to: number, mark: Mark): this {
    this.step(new RemoveMarkStep(from, to, mark));

    return this;
  }

  /** Replaces `[from, to)` with `content`. */
  replace(from: number, to: number, content: Slice): this {
    return this.replaceWith(from, to, content);
  }

  /** Replaces `[from, to)` with loose content, which is turned into a slice. */
  replaceWith(from: number, to: number, content: ReplaceContent): this {
    const slice =
      content instanceof SliceClass ? content : contentAsSlice(this.doc.resolve(from), content);
    const plan = planReplace(this.doc, from, to, slice);

    if (!plan) {
      return this;
    }

    for (const range of plan.ranges) {
      this.step(new ReplaceStep(range.from, range.to, range.slice));
    }

    return this;
  }

  /** Sets attributes on the node that starts at `pos`. */
  setNodeAttrs(pos: number, type: NodeType, attrs: Attrs): this {
    this.step(new AttrStep(pos, type, attrs));

    return this;
  }

  /**
   * Applies a single step.
   *
   * A step the schema rejects is dropped, so a command can compose several steps without checking
   * each one; the return value says whether it was applied.
   */
  step(step: Step): boolean {
    const result = step.apply(this.doc);

    if (!result.doc) {
      return false;
    }

    this.docs.push(this.doc);
    this.steps.push(step);
    this.mapping.appendMap(step.getMap());
    this.doc = result.doc;

    return true;
  }

  /** Serializes the applied steps. */
  toJSON(): StepJSON[] {
    return this.steps.map((step) => step.toJSON());
  }

  toString(): string {
    return `Transform(${this.steps.length} steps)`;
  }

  /**
   * Wraps the content between `from` and `to` in a new node.
   *
   * The wrapped content keeps its own structure, so wrapping a paragraph in a blockquote re-uses
   * the paragraph node instead of copying it.
   */
  wrap(from: number, to: number, type: NodeType, attrs?: Attrs): this {
    const content = this.doc.content.cut(from, to);

    if (content.size === 0) {
      return this;
    }

    const slice = new SliceClass(Fragment.from([type.create(attrs ?? null, content)]), 0, 0);

    return this.replaceWith(from, to, slice);
  }
}

/**
 * Describes how to join the two blocks around `pos`.
 *
 * Joining merges the content of the second block into the first, which keeps both sides' marks
 * and attributes; the position sits on the opening token of the second block, so the joined node
 * starts one node size before it. Text is not joined this way — two text runs next to each other
 * are already one run as far as the document is concerned, so a boundary inside text is deleted
 * rather than joined.
 */
function joinAt(doc: Node, pos: number): { content: Fragment; from: number; to: number } | null {
  const $pos = doc.resolve(pos);
  const before = $pos.nodeBefore();
  const after = $pos.nodeAfter();

  if (
    !before ||
    !after ||
    before === after ||
    before.isText ||
    after.isText ||
    before.isLeaf ||
    after.isLeaf
  ) {
    return null;
  }

  const joined = before.copy(before.content.append(after.content));

  // Joining has to leave a node whose own content model is complete, so joining a
  // paragraph with a list, for instance, is refused rather than half done.
  if (!before.type.contentMatch.canReplace(0, 0, Fragment.empty, joined.content)) {
    return null;
  }

  const from = pos - before.nodeSize;

  return { content: Fragment.from([joined]), from, to: from + before.nodeSize + after.nodeSize };
}
