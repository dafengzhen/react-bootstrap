/** Small array utilities used across the transform and schema layers. */

/** Returns `true` when both arrays hold the same elements under `eq`, which defaults to `===`. */
export function arraysEqual<T>(
  a: readonly T[],
  b: readonly T[],
  eq: (left: T, right: T) => boolean = (left, right) => left === right,
): boolean {
  if (a === b) {
    return true;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (!eq(a[i]!, b[i]!)) {
      return false;
    }
  }

  return true;
}

/** Index of the last element matching `predicate`, or `-1`. */
export function findLastIndex<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean,
): number {
  for (let i = items.length - 1; i >= 0; i--) {
    if (predicate(items[i]!, i)) {
      return i;
    }
  }

  return -1;
}

/** Inserts `items` at `index` without mutating the source array. */
export function insertAt<T>(items: readonly T[], index: number, inserted: readonly T[]): T[] {
  return [...items.slice(0, index), ...inserted, ...items.slice(index)];
}

/** Replaces a single element, returning a new array. */
export function replaceAt<T>(items: readonly T[], index: number, value: T): T[] {
  const copy = items.slice();
  copy[index] = value;
  return copy;
}

/** `Array.prototype.slice` with a `readonly` friendly signature; `to` defaults to the end. */
export function slice<T>(items: readonly T[], from: number, to?: number): T[] {
  return items.slice(from, to ?? items.length);
}

/** Replaces the range `[from, to)` with `inserted`, returning a new array. */
export function splice<T>(
  items: readonly T[],
  from: number,
  to: number,
  inserted: readonly T[],
): T[] {
  return [...items.slice(0, from), ...inserted, ...items.slice(to)];
}
