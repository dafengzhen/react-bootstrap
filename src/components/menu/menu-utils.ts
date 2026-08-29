import { Children, cloneElement, isValidElement, type ReactNode } from 'react';

import type { EventKey } from './types';

export const isSameKey = (a: EventKey | undefined, b: EventKey | undefined): boolean =>
  a != null && b != null && String(a) === String(b);

export const normalizeActiveKeys = (value: EventKey | EventKey[] | undefined): EventKey[] => {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

export const toggleActiveKeys = (keys: EventKey[], key: EventKey): EventKey[] => {
  const next = [...keys];
  const index = next.findIndex((item) => isSameKey(item, key));
  if (index === -1) {
    next.push(key);
  } else {
    next.splice(index, 1);
  }
  return next;
};

export const renderMenuChildren = (children: ReactNode, level: number): ReactNode =>
  Children.map(children, (child, index) => {
    if (
      isValidElement<{ eventKey?: EventKey }>(child) &&
      child.props.eventKey == null &&
      typeof child.type === 'function' &&
      'displayName' in child.type &&
      (child.type.displayName === 'MenuItem' || child.type.displayName === 'MenuSubMenu')
    ) {
      return cloneElement(child, { eventKey: `menu-${level}-${index}` });
    }
    return child;
  });
