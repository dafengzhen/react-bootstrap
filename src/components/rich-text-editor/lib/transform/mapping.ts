import type { StepMap } from './step-map.ts';

import { StepMap as StepMapClass } from './step-map.ts';

/**
 * An ordered list of step maps.
 *
 * A transaction produces one map per step; a `Mapping` chains them so a position from before the
 * transaction can be carried to the position it has afterwards. History, collaboration and
 * decorations all build on this.
 */
export class Mapping {
  /** The maps, in the order the steps were applied. */
  readonly maps: readonly StepMap[];

  /**
   * The mapping that undoes this one.
   *
   * Maps are inverted in reverse order, which is what History needs to rebuild the positions of
   * an undone transaction.
   */
  get inverse(): Mapping {
    if (!this.inverted) {
      const maps: StepMap[] = [];

      for (let i = this.maps.length - 1; i >= 0; i--) {
        maps.push(invertMap(this.maps[i]!));
      }

      this.inverted = new Mapping(maps);
    }

    return this.inverted;
  }

  /** Number of maps in the chain. */
  get size(): number {
    return this.maps.length;
  }

  /** Maps from the end back to the start, built on demand. */
  private inverted: Mapping | null = null;

  constructor(maps: readonly StepMap[] = []) {
    this.maps = maps;
  }

  /** Adds a map to the end of the chain. */
  appendMap(map: StepMap): void {
    (this.maps as StepMap[]).push(map);
    this.inverted = null;
  }

  /** Adds every map of `mapping` to the end of this chain. */
  appendMapping(mapping: Mapping): void {
    for (const map of mapping.maps) {
      (this.maps as StepMap[]).push(map);
    }

    this.inverted = null;
  }

  /** Maps `pos` through every map in the chain. */
  map(pos: number, assoc = 1): number {
    let result = pos;

    for (const map of this.maps) {
      result = map.map(result, assoc);
    }

    return result;
  }

  /** Detailed mapping of `pos` through the whole chain. */
  mapResult(pos: number, assoc = 1): { deleted: boolean; deletedAfter: boolean; pos: number } {
    let deleted = false;
    let deletedAfter = false;
    let result = pos;

    for (const map of this.maps) {
      const mapped = map.mapResult(result, assoc);

      if (mapped.deleted) {
        deleted = true;
      }

      // The last map decides where the position ended up, so only its neighbourhood says
      // whether the content *after* the position was deleted: an earlier deletion that a later
      // insertion replaced is not what a caller holding a position cares about.
      deletedAfter = mapped.deletedAfter;

      result = mapped.pos;
    }

    return { deleted, deletedAfter, pos: result };
  }

  toString(): string {
    return `Mapping(${this.maps.map((map) => map.toString()).join(' -> ')})`;
  }
}

/**
 * Inverts a single step map.
 *
 * Every range `[oldStart, newStart, oldLength, newLength]` becomes
 * `[newStart, oldStart, newLength, oldLength]`, sorted by the new start.
 */
export function invertMap(map: StepMap): StepMap {
  const ranges: number[][] = [];

  for (let i = 0; i < map.ranges.length; i += 4) {
    ranges.push([map.ranges[i + 1]!, map.ranges[i]!, map.ranges[i + 3]!, map.ranges[i + 2]!]);
  }

  return new StepMapClass(ranges.sort((a, b) => a[0]! - b[0]!).flat());
}
