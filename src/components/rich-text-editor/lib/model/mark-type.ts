import type { AttrSpec } from '../schema/attrs.ts';
import type { MarkSpec } from '../schema/mark-spec.ts';
import type { Attrs } from '../util/object.ts';

import { Mark } from './mark.ts';

/** Computes the attribute bag of a node or mark created by a type. */
export type AttrComputer = (attrs: Attrs | undefined) => Attrs;

/**
 * The mark half of the schema type system: attribute defaults, exclusivity rules and
 * mark creation, so the model layer never has to know how marks are declared. Instances
 * are created by `Schema` and are immutable afterwards.
 */
export class MarkType {
  /** Resolved `excludes` list: mark types this mark cannot share text with. */
  excludes: readonly MarkType[] = [];

  readonly name: string;

  readonly spec: MarkSpec;

  get attrs(): Readonly<Record<string, AttrSpec>> {
    return this.attrSpecs;
  }

  /** `false` when typing right after the mark should not extend it. */
  get inclusive(): boolean {
    return this.spec.inclusive !== false;
  }

  private readonly attrSpecs: Record<string, AttrSpec>;

  private readonly compute: AttrComputer;

  private readonly overlapCheck: ((a: Mark, b: Mark) => boolean) | null;

  constructor(
    name: string,
    spec: MarkSpec,
    excludes: readonly MarkType[] = [],
    attrSpecs: Record<string, AttrSpec> = {},
    compute: AttrComputer = () => ({}),
    overlapCheck: ((a: Mark, b: Mark) => boolean) | null = null,
  ) {
    this.name = name;
    this.spec = spec;
    this.excludes = excludes;
    this.attrSpecs = attrSpecs;
    this.compute = compute;
    this.overlapCheck = overlapCheck;
  }

  /** Whether two marks of this type may coexist in the same mark set. */
  allowsAttrsOverlap(a: Mark, b: Mark): boolean {
    return this.overlapCheck ? this.overlapCheck(a, b) : true;
  }

  /** Attribute spec, if declared. */
  attrSpec(name: string): AttrSpec | undefined {
    return this.attrSpecs[name];
  }

  /** Creates a mark of this type, filling in attribute defaults. */
  create(attrs?: Attrs): Mark {
    return new Mark(this, this.compute(attrs));
  }

  /** Whether the given attribute name is declared by this mark type. */
  hasAttr(name: string): boolean {
    return name in this.attrSpecs;
  }

  /**
   * Filled in by `Schema` once every mark type exists.
   *
   * @internal
   */
  setExcludes(excludes: readonly MarkType[]): void {
    this.excludes = excludes;
  }

  toString(): string {
    return this.name;
  }

  /** Whether `attrs` satisfies every attribute spec. Returns a problem or `null`. */
  validateAttrs(attrs: Attrs): null | string {
    for (const [name, spec] of Object.entries(this.attrSpecs)) {
      const value = attrs[name];

      if (value === undefined || value === null) {
        if (spec.required) {
          return `missing required attribute "${name}"`;
        }

        continue;
      }

      if (spec.validate && !spec.validate(value)) {
        return `invalid value for attribute "${name}"`;
      }
    }

    return null;
  }
}
