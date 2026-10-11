import type { Mark } from '../model/mark.ts';
import type { NodeType } from '../model/node-type.ts';
import type { Node } from '../model/node.ts';
import type { Slice } from '../model/slice.ts';
import type { StepMap } from './step-map.ts';

import { Fragment } from '../model/fragment.ts';
import { Slice as SliceClass } from '../model/slice.ts';
import { ErrorCode, invariantError } from '../util/errors.ts';
import { applyMark } from './mark-apply.ts';
import { replaceStep } from './replace.ts';
import { sliceBetween } from './slice-building.ts';
import { StepMap as StepMapClass } from './step-map.ts';
import { StepResult } from './step-result.ts';

/** Serialized form of a step. */
export interface StepJSON {
  [key: string]: unknown;
  stepType: string;
}

/**
 * A step is the smallest reversible edit of a document: every change a user can make is a list of
 * steps, which is what makes a transaction invertible (undo), mappable (collaboration) and
 * serializable (persistence or a wire protocol).
 *
 * ```ts
 * const step = new ReplaceStep(6, 6, sliceOfText('x'));
 * const undone = step.invert(doc).apply(step.apply(doc).doc!);
 * ```
 */
export abstract class Step {
  /** Name used in serialized form and diagnostics. */
  abstract get stepType(): string;

  /** Applies this step to `doc`. */
  abstract apply(doc: Node): StepResult;

  /** How this step moved positions. */
  abstract getMap(): StepMap;

  /** The step that undoes this one, against the document it was applied to. */
  abstract invert(doc: Node): Step;

  /**
   * Maps this step through a concurrent change, or reports that it cannot be mapped.
   *
   * Three outcomes, never to be confused: a rebuilt step whose positions survive the change — a
   * mark or attribute step too, since consuming no position *itself* says nothing about whether the
   * change moved what it addresses; `null` when the change destroyed the content the step
   * describes, which a caller *must* drop rather than treat as "no change", or the step would edit
   * text it was never written for; and {@link ErrorCode.STEP_MAPPING_REQUIRED} when a subclass
   * never overrode this at all — an editor bug, not a document condition, and a step type that
   * silently kept its old positions would corrupt every document it is later applied to.
   *
   * @param mapping - How an earlier, concurrent change moved positions.
   */
  map(_mapping: StepMap = StepMapClass.empty): null | Step {
    const stepType = stepTypeOf(this);

    throw invariantError(
      ErrorCode.STEP_MAPPING_REQUIRED,
      `Step type "${stepType}" does not implement map(), so it cannot be mapped through a concurrent change; implement map() to return the mapped step, or null when the change destroyed what the step describes`,
      { stepType },
    );
  }

  /** Merges `other` into this step when both describe the same kind of edit. */
  merge(other: Step): null | Step {
    void other;
    return null;
  }

  /** Serializes the step for storage or transfer. */
  abstract toJSON(): StepJSON;

  toString(): string {
    return this.stepType;
  }
}

/** Applies a mark to text. */
export class AddMarkStep extends Step {
  readonly from: number;

  readonly mark: Mark;

  readonly to: number;

  override get stepType(): string {
    return 'addMark';
  }

  constructor(from: number, to: number, mark: Mark) {
    super();
    this.from = from;
    this.to = to;
    this.mark = mark;
  }

  override apply(doc: Node): StepResult {
    const next = applyMark(doc, this.from, this.to, this.mark, false);

    return next ? StepResult.from(next) : StepResult.fail('No text to mark in this range');
  }

  override getMap(): StepMap {
    return StepMapClass.empty;
  }

  override invert(): Step {
    return new RemoveMarkStep(this.from, this.to, this.mark);
  }

  /**
   * Maps this step through a concurrent change: `from` with association `1`, so content inserted
   * where the marked text starts belongs to the mark the author applied to the text in front of
   * them, and `to` with association `-1`, so an insertion exactly at the end stays outside.
   *
   * The result is a rebuilt step, or `null` when the text is no longer one stretch — mapping
   * through deleted content would mark text the author never selected, the corruption the identity
   * this method used to return caused. A deletion that reaches the first position of the range, or
   * that starts inside it, answers `null` as well: one step describes one continuous range, and a
   * caller that wants the mark on what is left rebuilds the step from the positions it wants.
   *
   * ```ts
   * const step = new AddMarkStep(2, 5, bold);
   *
   * step.map(StepMap.offset(7));         // AddMarkStep(9..12, bold)
   * step.map(new StepMap([2, 2, 3, 0])); // null: the marked text is gone
   * ```
   *
   * @param mapping - How an earlier, concurrent change moved positions.
   */
  override map(mapping: StepMap = StepMapClass.empty): null | Step {
    if (contentDeletedBetween(mapping, this.from, this.to)) {
      return null;
    }

    const from = mapping.map(this.from, 1);
    const to = mapping.map(this.to, -1);

    if (from === this.from && to === this.to) {
      return this;
    }

    return to <= from ? null : new AddMarkStep(from, to, this.mark);
  }

  override merge(other: Step): null | Step {
    if (!(other instanceof AddMarkStep) || !other.mark.eq(this.mark)) {
      return null;
    }

    return new AddMarkStep(Math.min(this.from, other.from), Math.max(this.to, other.to), this.mark);
  }

  override toJSON(): StepJSON {
    return { from: this.from, mark: this.mark.toJSON(), stepType: this.stepType, to: this.to };
  }

  override toString(): string {
    return `AddMarkStep(${this.from}..${this.to}, ${this.mark.name})`;
  }
}

/** Sets attributes on the node that starts at `pos`. */
export class AttrStep extends Step {
  /** Attributes to merge in; a `null` value removes the attribute. */
  readonly attrs: Record<string, unknown>;

  /** Position right before the node whose attributes change. */
  readonly pos: number;

  readonly type: NodeType;

  override get stepType(): string {
    return 'attr';
  }

  constructor(pos: number, type: NodeType, attrs: Record<string, unknown>) {
    super();
    this.pos = pos;
    this.type = type;
    this.attrs = attrs;
  }

  override apply(doc: Node): StepResult {
    const node = doc.nodeStartingAt(this.pos);

    if (!node || node.type !== this.type) {
      return StepResult.fail(`No ${this.type.name} node starts at ${this.pos}`);
    }

    return StepResult.from(doc.replaceNodeAt(this.pos, node.withAttrs(this.attrs)));
  }

  override getMap(): StepMap {
    return StepMapClass.empty;
  }

  override invert(doc: Node): Step {
    const node = doc.nodeStartingAt(this.pos);
    const current: Record<string, unknown> = {};

    for (const name of Object.keys(this.attrs)) {
      current[name] = node ? node.attrs[name] : undefined;
    }

    return new AttrStep(this.pos, this.type, current);
  }

  /**
   * Maps this step's position through a concurrent change: a step that consumes and produces no
   * positions *itself* says nothing about what somebody else's change did to the position it
   * addresses, so an insertion before the node moves it and a deletion that starts at it removes
   * it.
   *
   * ```ts
   * const step = new AttrStep(0, paragraph, { align: 'center' });
   *
   * step.map(StepMap.offset(2));         // AttrStep(2, paragraph, ...)
   * step.map(new StepMap([0, 0, 2, 0])); // null: the node is gone
   * ```
   *
   * @param mapping - How an earlier, concurrent change moved positions.
   */
  override map(mapping: StepMap = StepMapClass.empty): null | Step {
    // The node's opening token occupies exactly one position, so a deletion that removes that
    // position removes the node this step addresses — whether it deleted the node itself or
    // content the node started inside of.
    if (contentDeletedBetween(mapping, this.pos, this.pos + 1)) {
      return null;
    }

    const pos = mapping.map(this.pos, 1);

    return pos === this.pos ? this : new AttrStep(pos, this.type, this.attrs);
  }

  override merge(other: Step): null | Step {
    if (!(other instanceof AttrStep) || other.pos !== this.pos || other.type !== this.type) {
      return null;
    }

    return new AttrStep(this.pos, this.type, { ...this.attrs, ...other.attrs });
  }

  override toJSON(): StepJSON {
    return { attrs: this.attrs, pos: this.pos, stepType: this.stepType, type: this.type.name };
  }

  override toString(): string {
    return `AttrStep(${this.pos}, ${this.type.name}, ${JSON.stringify(this.attrs)})`;
  }
}

/** Removes a mark from text. */
export class RemoveMarkStep extends Step {
  readonly from: number;

  readonly mark: Mark;

  readonly to: number;

  override get stepType(): string {
    return 'removeMark';
  }

  constructor(from: number, to: number, mark: Mark) {
    super();
    this.from = from;
    this.to = to;
    this.mark = mark;
  }

  override apply(doc: Node): StepResult {
    const next = applyMark(doc, this.from, this.to, this.mark, true);

    return next ? StepResult.from(next) : StepResult.fail('Nothing to unmark in this range');
  }

  override getMap(): StepMap {
    return StepMapClass.empty;
  }

  override invert(): Step {
    return new AddMarkStep(this.from, this.to, this.mark);
  }

  /**
   * Maps this step through a concurrent change, the counterpart of {@link AddMarkStep.map}: the
   * same associations, and `null` when the text it unmarks is gone, since the marks of text that no
   * longer exists cannot be changed.
   *
   * @param mapping - How an earlier, concurrent change moved positions.
   */
  override map(mapping: StepMap = StepMapClass.empty): null | Step {
    if (contentDeletedBetween(mapping, this.from, this.to)) {
      return null;
    }

    const from = mapping.map(this.from, 1);
    const to = mapping.map(this.to, -1);

    if (from === this.from && to === this.to) {
      return this;
    }

    return to <= from ? null : new RemoveMarkStep(from, to, this.mark);
  }

  override merge(other: Step): null | Step {
    if (!(other instanceof RemoveMarkStep) || !other.mark.eq(this.mark)) {
      return null;
    }

    return new RemoveMarkStep(
      Math.min(this.from, other.from),
      Math.max(this.to, other.to),
      this.mark,
    );
  }

  override toJSON(): StepJSON {
    return { from: this.from, mark: this.mark.toJSON(), stepType: this.stepType, to: this.to };
  }

  override toString(): string {
    return `RemoveMarkStep(${this.from}..${this.to}, ${this.mark.name})`;
  }
}

/** Replaces a range with a slice: the step behind almost every edit. */
export class ReplaceStep extends Step {
  /** Start of the replaced range. */
  readonly from: number;

  /** Content to insert. */
  readonly slice: Slice;

  /** End of the replaced range. */
  readonly to: number;

  override get stepType(): string {
    return 'replace';
  }

  private readonly stepMap: null | StepMap;

  constructor(from: number, to: number, slice: Slice, stepMap?: StepMap) {
    super();
    this.from = from;
    this.to = to;
    this.slice = slice;
    this.stepMap = stepMap ?? null;
  }

  override apply(doc: Node): StepResult {
    const result = replaceStep(doc, this.from, this.to, this.slice);

    return result
      ? StepResult.from(result.doc)
      : StepResult.fail('Replace step could not be applied');
  }
  override getMap(): StepMap {
    return (
      this.stepMap ?? new StepMapClass([this.from, this.from, this.to - this.from, this.slice.size])
    );
  }

  override invert(doc: Node): Step {
    return new ReplaceStep(
      this.from,
      this.from + this.slice.size,
      sliceBetween(doc, this.from, this.to),
      this.stepMap ?? undefined,
    );
  }

  /**
   * Moves this step's range through a concurrent change: the only step that consumes and produces
   * positions, so the only one whose mapping can be wrong in a way nobody notices — applying it at
   * the positions it had *before* the change silently edits the wrong text. The range keeps its
   * length whenever the change happened outside it and grows over an insertion inside it or on one
   * of its ends; an inversion's length is the size of the slice the original step inserted, which
   * is how {@link ReplaceStep.invert} describes an undone replacement.
   *
   * ```ts
   * // Insert "a" at 2 while someone else inserts "xyz" at 6.
   * step.map(new StepMap([6, 6, 0, 3])); // ReplaceStep(2..2, 1 positions) — unchanged, 2 is before 6
   * ```
   *
   * A change that deleted content this step has to consume leaves no range meaning the same thing,
   * so it returns `null`; it never returns `this`, which a caller could mistake for "nothing moved"
   * — even an untouched range comes back as a new step.
   *
   * @param mapping - How an earlier, concurrent change moved positions.
   */
  override map(mapping: StepMap): null | Step {
    // The content this step consumes is gone when a concurrent change removed one of those
    // positions; a change that merely starts or ends on the range boundary removed content next to
    // the step, not the position the step starts at, so it is not a conflict.
    if (contentDeletedBetween(mapping, this.from, this.to)) {
      return null;
    }

    // Both ends use association `1`, so content inserted exactly at either end belongs to the
    // range and it stays one continuous piece: an insertion at the start pushes the whole range
    // along, one at the end leaves no hole. Association `-1` at the start would keep the step in
    // front of what somebody else inserted right where it edits; at the end it would cut that
    // content off.
    const from = mapping.map(this.from, 1);
    const to = mapping.map(this.to, 1);

    return new ReplaceStep(from, to, this.slice);
  }

  override toJSON(): StepJSON {
    return { from: this.from, slice: this.slice.toJSON(), stepType: this.stepType, to: this.to };
  }

  override toString(): string {
    return `ReplaceStep(${this.from}..${this.to}, ${this.slice.size} positions)`;
  }
}

/** Builds a closed slice that inserts `text` with the given marks. */
export function textSlice(type: NodeType, text: string, marks: readonly Mark[] = []): Slice {
  return new SliceClass(Fragment.from([type.create(undefined, text, marks)]), 0, 0);
}

/**
 * Whether a concurrent change removed content inside `[from, to)`.
 *
 * The question a step that addresses existing content asks before it maps: not "did the mapping
 * touch this position" — an insertion touches where it lands and moves what follows, which is a
 * move, not a loss — but "is the content this step is about still there", which only a range that
 * removed something answers with yes. A deletion reaching the first position of the range removes
 * content the step describes, and one starting inside it splits what it describes, which one step
 * cannot describe. A step that only inserts has the single position it inserts at, gone as soon as
 * it lies inside deleted text. A deletion starting at the *end* of the range is not one of these:
 * it removed what comes after the step, which describes the same content it always did.
 */
function contentDeletedBetween(mapping: StepMap, from: number, to: number): boolean {
  for (let i = 0; i < mapping.ranges.length; i += 4) {
    const oldStart = mapping.ranges[i]!;
    const oldLength = mapping.ranges[i + 2]!;

    if (oldLength === 0) {
      continue;
    }

    const removedEnd = oldStart + oldLength;
    const startRemoved = oldStart <= from && from < removedEnd;
    const split = oldStart > from && oldStart < to;

    if (startRemoved || split) {
      return true;
    }
  }

  return false;
}

/**
 * Name of a step type, for diagnostics and errors: `Step.stepType` is abstract, so a malformed
 * subclass can be missing it, and reading it would throw an error that says nothing about the
 * actual problem — the constructor's name is the useful answer then.
 */
function stepTypeOf(step: Step): string {
  return typeof step.stepType === 'string' ? step.stepType : step.constructor.name;
}
