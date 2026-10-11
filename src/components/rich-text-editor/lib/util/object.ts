/**
 * Structural helpers shared by the document model, schema and serialization layers.
 *
 * Everything here is dependency free and works in any JavaScript runtime, which keeps the headless
 * core portable.
 */

/** Plain key/value bag used for node and mark attributes. */
export type Attrs = Record<string, unknown>;

const hasOwnProperty = Object.prototype.hasOwnProperty;

/** Returns the own keys of `attrs`, or an empty array for `undefined`. */
export function attrsKeys(attrs: Attrs | null | undefined): string[] {
  return attrs ? Object.keys(attrs) : [];
}

/** Shallow, frozen copy of `attrs`. Frozen objects make accidental mutation loud. */
export function freezeAttrs(attrs: Attrs | null | undefined): Readonly<Attrs> {
  if (isEmptyAttrs(attrs)) {
    return EMPTY_ATTRS;
  }

  return Object.freeze({ ...attrs });
}

/** Returns `true` when `attrs` has no own keys. */
export function isEmptyAttrs(attrs: Attrs | null | undefined): boolean {
  return !attrs || Object.keys(attrs).length === 0;
}

/** Returns `true` when `value` is a non-null object (never an array). */
export function isPlainObject(value: unknown): value is Attrs {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Shared frozen empty attribute bag, so empty attrs never allocate. */
export const EMPTY_ATTRS: Readonly<Attrs> = Object.freeze({});

/** Shallow clone helper used for copy-on-write attribute updates. */
export function assignAttrs(base: Attrs | null | undefined, patch: Attrs): Attrs {
  return { ...base, ...patch };
}

/** Drops `undefined` valued keys so serialized JSON stays canonical. */
export function compactAttrs(attrs: Attrs | null | undefined): Attrs | undefined {
  if (!attrs) {
    return undefined;
  }

  const result: Attrs = {};

  for (const [key, value] of Object.entries(attrs)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

/** Deep comparison for JSON-compatible values. */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b || a === null || b === null) {
    return false;
  }

  if (typeof a !== 'object') {
    return false;
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }

    return true;
  }

  const left = a as Attrs;
  const right = b as Attrs;
  const leftKeys = Object.keys(left);

  if (leftKeys.length !== Object.keys(right).length) {
    return false;
  }

  for (const key of leftKeys) {
    if (!hasOwnProperty.call(right, key) || !deepEqual(left[key], right[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Compares two attribute bags while ignoring `undefined` values, which is how "does this
 * node/mark carry these attributes?" queries are answered; no `expected` matches everything.
 */
export function matchesAttrs(attrs: Attrs, expected: Attrs | null | undefined): boolean {
  if (!expected) {
    return true;
  }

  for (const [key, value] of Object.entries(expected)) {
    if (value === undefined) {
      continue;
    }

    if (!deepEqual(attrs[key], value)) {
      return false;
    }
  }

  return true;
}

/** Stable, key-sorted JSON string; handy for caching and snapshot comparison. */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value) ?? 'null';
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  const entries = Object.entries(value as Attrs)
    .filter(([, item]) => item !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

  return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(',')}}`;
}
