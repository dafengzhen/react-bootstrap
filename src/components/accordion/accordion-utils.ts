import type { AccordionEventKey } from './types';

export const isSameEventKey = (a: AccordionEventKey, b: AccordionEventKey): boolean =>
  a != null && b != null && String(a) === String(b);

export const toEventKeyArray = (
  key: AccordionEventKey | AccordionEventKey[] | undefined,
): AccordionEventKey[] => {
  if (key == null) {
    return [];
  }
  return Array.isArray(key) ? key : [key];
};
