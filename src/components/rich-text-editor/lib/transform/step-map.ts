/**
 * A description of how a document change moved positions.
 *
 * Every step produces one map, and `Mapping` chains them so an old position can be carried
 * through a whole transaction. History, search, comments, decorations and future collaboration
 * all rely on this.
 *
 * Ranges are stored as sorted `[oldStart, newStart, oldLength, newLength]` tuples.
 */
export class StepMap {
  /** A map that leaves every position untouched. */
  static get empty(): StepMap {
    return EMPTY_MAP;
  }

  /** The changed ranges, four numbers each, sorted by `oldStart`. */
  readonly ranges: readonly number[];

  /** Size of the document this map was built against, when known. */
  get documentSize(): number {
    return this.oldSize;
  }

  /** Number of changed ranges. */
  get rangeCount(): number {
    return this.ranges.length / 4;
  }

  /** Total size of the document before the change, when known. */
  private readonly oldSize: number;

  constructor(ranges: readonly number[], oldSize = 0) {
    this.ranges = ranges;
    this.oldSize = oldSize;
  }

  /** A map that shifts every position by `offset`; an offset of `0` is the {@link empty} map. */
  static offset(offset: number): StepMap {
    return offset === 0 ? EMPTY_MAP : new StepMap([0, offset, 0, 0]);
  }

  /** Whether `pos` falls inside a range that was deleted. */
  deleted(pos: number): boolean {
    if (pos < 0) {
      return false;
    }

    for (let i = 0; i < this.ranges.length; i += 4) {
      const start = this.ranges[i]!;
      const length = this.ranges[i + 2]!;

      if (pos > start && pos < start + length) {
        return true;
      }
    }

    return false;
  }

  /** Whether a replaced range ends at `pos`. */
  deletedAfter(pos: number): boolean {
    for (let i = 0; i < this.ranges.length; i += 4) {
      if (this.ranges[i]! + this.ranges[i + 2]! === pos) {
        return true;
      }
    }

    return false;
  }

  /** Whether a replaced range starts at `pos`. */
  deletedBefore(pos: number): boolean {
    for (let i = 0; i < this.ranges.length; i += 4) {
      if (this.ranges[i]! === pos) {
        return true;
      }
    }

    return false;
  }

  /**
   * Maps `pos` through this change.
   *
   * @param assoc - `-1` keeps the position before an insertion at the same spot,
   * `1` moves it after
   */
  map(pos: number, assoc = 1): number {
    let result = pos;

    for (let i = 0; i < this.ranges.length; i += 4) {
      const oldStart = this.ranges[i]!;
      const newStart = this.ranges[i + 1]!;
      const oldLength = this.ranges[i + 2]!;
      const newLength = this.ranges[i + 3]!;

      if (oldStart > result) {
        // The range lies after the position, so it cannot move it.
        break;
      }

      if (result > oldStart + oldLength) {
        // The position lies after the range: keep its distance from the range and
        // account for the size difference.
        result = newStart + (result - oldStart - oldLength) + newLength;
        continue;
      }

      if (result === oldStart && assoc < 0) {
        // A position on the start of the range stays there when the association
        // asks for it; otherwise it follows the inserted content.
        result = newStart;
        continue;
      }

      result = newStart + newLength;
    }

    return result;
  }

  /**
   * Detailed mapping of `pos`, including the neighbourhood that decided where it went.
   *
   * This is {@link map} plus the flags, so the two always agree on the new position:
   * `mapResult(pos, assoc).pos === map(pos, assoc)`. A caller that only needs the new position
   * uses `map`; one that has to decide whether the content the position pointed at still exists
   * uses this.
   *
   * `deleted` is true only for a position strictly inside a replaced range, which is the only
   * case where the content the position referred to is gone. The two flags describe the
   * boundaries instead: `deletedBefore` is true when a replaced range starts exactly at `pos`,
   * and `deletedAfter` when one ends exactly at `pos`. A position on a boundary is not deleted —
   * it still has content on one of its sides — and the association decides which side the mapped
   * position takes.
   *
   * @param assoc - `-1` keeps the position before an insertion at the same spot,
   * `1` moves it after
   */
  mapResult(pos: number, assoc = 1): MapResult {
    // The position itself comes from `map`, so the two can never drift apart: every subtle
    // case of an association and of a range that only inserts or only deletes is decided in
    // exactly one place. What is left here is the neighbourhood, which `map` does not report.
    return {
      deleted: this.deleted(pos),
      deletedAfter: this.deletedAfter(pos),
      deletedBefore: this.deletedBefore(pos),
      pos: this.map(pos, assoc),
    };
  }

  toString(): string {
    return `StepMap(${this.ranges.join(',')})`;
  }
}

const EMPTY_MAP = new StepMap([]);

/** Detailed result of mapping a single position. */
export interface MapResult {
  /** Whether the position was strictly inside a deleted range. */
  deleted: boolean;
  /** Whether a replaced range ends exactly at the position. */
  deletedAfter: boolean;
  /** Whether a replaced range starts exactly at the position. */
  deletedBefore: boolean;
  /** The mapped position. */
  pos: number;
}

/** Builds a map for replacing `[from, to)` with `newLength` positions. */
export function replaceRangeMap(from: number, to: number, newLength: number, oldSize = 0): StepMap {
  if (from === to && newLength === 0) {
    return StepMap.empty;
  }

  return new StepMap([from, from, to - from, newLength], oldSize);
}
