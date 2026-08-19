import type { EventKey } from './types';

export const isSameKey = (a: EventKey | undefined, b: EventKey | undefined): boolean =>
  a != null && b != null && String(a) === String(b);
