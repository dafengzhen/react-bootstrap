import type { Node } from '../model/node.ts';
import type { ResolvedPos } from '../position/resolved-pos.ts';

import { resolvePosition } from '../position/resolved-pos.ts';
import { ErrorCode, schemaError } from '../util/errors.ts';

/** Convenience alias so callers can accept a mapping or a single step map. */
export type Mappable = PositionMapper | readonly PositionMapper[];

/** Anything able to map a position through a document change. */
export interface PositionMapper {
  /** Maps `pos` from the old document into the new one. */
  map: (pos: number, assoc?: number) => number;
}

/** Serialized form of a selection. */
export interface SelectionJSON {
  anchor: number;
  head: number;
  type: 'all' | 'node' | 'text';
}

/**
 * Base class of every selection.
 *
 * A selection is stored as an anchor and a head position: the anchor is where the selection started
 * and the head is where it currently ends, so backwards selections (head before anchor) keep their
 * direction.
 */
export abstract class Selection {
  /** Where the selection started. */
  readonly anchor: number;

  /** Where the selection currently ends. */
  readonly head: number;

  /** Resolved anchor, in the document the selection belongs to. */
  abstract get $anchor(): ResolvedPos;

  /** Resolved start position. */
  get $from(): ResolvedPos {
    return this.anchor <= this.head ? this.$anchor : this.$head;
  }

  /** Resolved head, in the document the selection belongs to. */
  abstract get $head(): ResolvedPos;

  /** Resolved end position. */
  get $to(): ResolvedPos {
    return this.anchor <= this.head ? this.$head : this.$anchor;
  }

  /** Document the selection was resolved against. */
  get doc(): Node {
    return this.$anchor.doc;
  }

  /** Whether the selection covers nothing. */
  abstract get empty(): boolean;

  /** Lower bound of the selection. */
  get from(): number {
    return Math.min(this.anchor, this.head);
  }

  /** Ranges covered by this selection, in document order. */
  get ranges(): readonly { $from: ResolvedPos; $to: ResolvedPos }[] {
    return [{ $from: this.$from, $to: this.$to }];
  }

  /** Text covered by this selection. */
  get textBetween(): string {
    return this.$from.doc.textBetween(this.from, this.to, '\n\n');
  }

  /** Upper bound of the selection. */
  get to(): number {
    return Math.max(this.anchor, this.head);
  }

  protected constructor(anchor: number, head: number) {
    this.anchor = anchor;
    this.head = head;
  }

  /** Whether two selections are equivalent. */
  eq(other: null | Selection | undefined): boolean {
    return (
      !!other &&
      this.anchor === other.anchor &&
      this.head === other.head &&
      this.constructor === other.constructor
    );
  }

  /**
   * Maps the selection through a document change.
   *
   * `assoc` follows the usual convention: `-1` prefers the position before an insertion, `1`
   * prefers the position after it. `bias` decides what happens to an empty selection that ends up
   * inside the replaced range.
   */
  abstract map(doc: Node, mapping: PositionMapper, assoc?: number, bias?: number): Selection;

  /** Serializes the selection. */
  abstract toJSON(): SelectionJSON;

  /** Anchor and head of the selection, for logging and equality messages. */
  toString(): string {
    return `${this.constructor.name}(${this.anchor}..${this.head})`;
  }
}

/**
 * Resolves a position inside `doc`, falling back to the closest valid position.
 *
 * A document loaded from JSON or reached through an out of date position can name a spot the
 * schema does not have, and throwing there would make a selection impossible to restore, so the
 * search walks outwards from `pos` before {@link schemaError} is raised.
 */
export function resolveCautiously(doc: Node, pos: number): ResolvedPos {
  const clamped = Math.max(0, Math.min(pos, doc.content.size));

  try {
    return resolvePosition(doc, clamped);
  } catch {
    for (let distance = 1; distance <= clamped; distance++) {
      const before = clamped - distance;

      if (before >= 0) {
        try {
          return resolvePosition(doc, before);
        } catch {
          // keep searching
        }
      }

      const after = clamped + distance;

      if (after <= doc.content.size) {
        try {
          return resolvePosition(doc, after);
        } catch {
          // keep searching
        }
      }
    }

    throw schemaError(ErrorCode.UNRESOLVABLE_POSITION, `Unable to resolve position ${pos}`, {
      position: pos,
    });
  }
}
