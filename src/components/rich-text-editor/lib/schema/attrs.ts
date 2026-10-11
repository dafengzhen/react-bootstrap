import type { Attrs } from '../util/object.ts';

/**
 * Declaration of a single node or mark attribute.
 *
 * ```ts
 * const headingLevel: AttrSpec = {
 *   default: 1,
 *   validate: (value) => Number(value) >= 1 && Number(value) <= 6,
 * };
 * ```
 */
export interface AttrSpec {
  /**
   * Normalizes the attribute value during node or mark creation. Returning
   * `undefined` removes the attribute.
   */
  compute?: (value: unknown, attrs: Attrs) => unknown;

  /**
   * Value applied when a caller omits the attribute. Attributes without a default
   * and without `required` are simply absent from the attribute bag.
   */
  default?: unknown;

  /** Whether the attribute must be present. */
  required?: boolean;

  /** Rejects invalid values when `NodeType.create` runs in a checked mode. */
  validate?: (value: unknown) => boolean;
}

/** Attribute declarations of a node or mark spec. */
export type AttrSpecs = Record<string, AttrSpec>;

/**
 * Builds the attribute computer of a node or mark type from its specs.
 *
 * The result is the one pipeline every attribute bag goes through, and it is strict in both
 * directions: a declared attribute is filled in from its default and normalized by its
 * `compute`, and an undeclared key is dropped. Dropping matters as much as filling, because
 * attribute bags are compared, hashed and serialized — a key the schema does not know would make
 * two otherwise identical nodes differ, and would put data in a document that no serializer and
 * no other schema can interpret.
 *
 * ```ts
 * const compute = createAttrComputer({ level: { default: 1 } });
 *
 * compute({ level: 3, typo: 'gone' }); // { level: 3 }
 * ```
 */
export function createAttrComputer(attrs: AttrSpecs): (input: Attrs | undefined) => Attrs {
  const names = Object.keys(attrs);

  if (names.length === 0) {
    return () => ({});
  }

  return (input) => {
    // Only declared names are copied over, which is what drops an undeclared key.
    const source: Attrs = {};

    if (input) {
      for (const name of names) {
        if (input[name] !== undefined) {
          source[name] = input[name];
        }
      }
    }

    const result: Attrs = source;

    for (const name of names) {
      const spec = attrs[name]!;
      const value = result[name] === undefined ? spec.default : result[name];

      if (value === undefined && !spec.required) {
        delete result[name];
        continue;
      }

      result[name] = spec.compute ? spec.compute(value, result) : value;
    }

    for (const name of Object.keys(result)) {
      if (result[name] === undefined) {
        delete result[name];
      }
    }

    return result;
  };
}

/**
 * Whether `input` carries a key the given specs do not declare.
 *
 * {@link createAttrComputer} drops those keys, so this is only needed by a caller that wants to
 * report the mistake instead of silently losing it — `Schema.node` and `Schema.nodeFromJSON` do
 * that while reading outside data.
 */
export function unknownAttrNames(attrs: AttrSpecs, input: Attrs | null | undefined): string[] {
  if (!input) {
    return [];
  }

  return Object.keys(input).filter((name) => !(name in attrs) && input[name] !== undefined);
}
