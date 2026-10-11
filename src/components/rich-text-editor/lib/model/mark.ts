import type { Schema } from '../schema/schema.ts';
import type { Attrs } from '../util/object.ts';
import type { MarkType } from './mark-type.ts';

import { ErrorCode, schemaError } from '../util/errors.ts';
import { compactAttrs, deepEqual, EMPTY_ATTRS, freezeAttrs, matchesAttrs } from '../util/object.ts';

/** Serialized form of a mark. */
export interface MarkJSON {
  attrs?: Attrs;
  type: string;
}

/**
 * Immutable character level formatting.
 *
 * A mark never mutates — attribute changes create a new instance — and equality compares
 * attribute values deeply, so key order does not matter.
 */
export class Mark {
  /** Frozen attribute bag. */
  readonly attrs: Readonly<Attrs>;

  /** Mark type, resolved against the schema. */
  readonly type: MarkType;

  /** Mark name, e.g. `bold`. */
  get name(): string {
    return this.type.name;
  }

  constructor(type: MarkType, attrs: Attrs = EMPTY_ATTRS) {
    this.type = type;
    this.attrs = freezeAttrs(attrs);
  }

  /**
   * Deserializes a mark against a schema.
   *
   * @throws {SchemaError} when the JSON names a mark type the schema does not have
   */
  static fromJSON(schema: Schema, json: MarkJSON): Mark {
    const type = schema.marks[json.type];

    if (!type) {
      throw schemaError(ErrorCode.UNKNOWN_MARK_TYPE, `Unknown mark type: ${json.type}`, {
        markType: json.type,
      });
    }

    return type.create(json.attrs ?? {});
  }

  /** `true` when both marks share type and attributes. */
  eq(other: Mark | null | undefined): boolean {
    if (!other) {
      return false;
    }

    return this === other || (this.type === other.type && deepEqual(this.attrs, other.attrs));
  }

  /** Whether `set` already holds a mark of this type that this one may coexist with. */
  isInSet(set: null | readonly Mark[]): boolean {
    return !!set && isMarkInSet(this, set);
  }

  /** `true` when every attribute given in `attrs` equals this mark's value for it. */
  matchesAttrs(attrs: Attrs | null | undefined): boolean {
    return matchesAttrs(this.attrs, attrs);
  }

  toJSON(): MarkJSON {
    const attrs = compactAttrs(this.attrs);
    return attrs ? { attrs, type: this.type.name } : { type: this.type.name };
  }

  /** New mark with the given attributes merged in. */
  withAttrs(attrs: Attrs): Mark {
    return this.type.create({ ...this.attrs, ...attrs });
  }
}

/**
 * Set membership follows the schema merging rules rather than raw attribute equality:
 * two marks of the same type are "in the same set" unless the type declares attributes
 * that make them mutually exclusive.
 */
export function isMarkInSet(mark: Mark, set: readonly Mark[]): boolean {
  for (const other of set) {
    if (other.type === mark.type && other.type.allowsAttrsOverlap(mark, other)) {
      return true;
    }
  }

  return false;
}

/** Element-wise mark equality, which is how strict mark sets are compared. */
export function markSetEqual(a: readonly Mark[], b: readonly Mark[]): boolean {
  if (a === b) {
    return true;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (!a[i]!.eq(b[i]!)) {
      return false;
    }
  }

  return true;
}

/** De-duplicates a mark set, returning the input when it held no duplicates. */
export function normalizeMarkSet(marks: readonly Mark[]): readonly Mark[] {
  if (marks.length === 0) {
    return marks;
  }

  const result: Mark[] = [];

  for (const mark of marks) {
    if (!result.some((existing) => existing.eq(mark))) {
      result.push(mark);
    }
  }

  return result.length === marks.length ? marks : result;
}
