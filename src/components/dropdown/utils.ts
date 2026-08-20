import type { Placement } from '../../utils';
import type { DropdownAlign, DropdownAlignOption, DropdownDirection } from './types';

export const DROP_CLASSES: Record<DropdownDirection, string> = {
  down: 'dropdown',
  'down-centered': 'dropdown dropdown-center',
  end: 'dropend',
  start: 'dropstart',
  up: 'dropup',
  'up-centered': 'dropup dropup-center',
};

export const getBaseAlign = (align?: DropdownAlignOption): DropdownAlign | undefined => {
  if (align == null || typeof align === 'string') {
    return align;
  }
  return align.xs;
};

export const getDropdownPlacement = (drop: DropdownDirection, align?: DropdownAlign): Placement => {
  const alignEnd = align === 'end';
  switch (drop) {
    case 'down-centered':
      return 'bottom';
    case 'end':
      return alignEnd ? 'right-end' : 'right-start';
    case 'start':
      return alignEnd ? 'left-end' : 'left-start';
    case 'up':
      return alignEnd ? 'top-end' : 'top-start';
    case 'up-centered':
      return 'top';
    default:
      return alignEnd ? 'bottom-end' : 'bottom-start';
  }
};

export const getAlignClassNames = (align?: DropdownAlignOption): string[] => {
  if (align == null) {
    return [];
  }
  if (typeof align === 'string') {
    return [`dropdown-menu-${align}`];
  }
  return Object.entries(align)
    .filter((entry): entry is [string, DropdownAlign] => entry[1] !== undefined)
    .map(([breakpoint, value]) => `dropdown-menu-${breakpoint}-${value}`);
};
