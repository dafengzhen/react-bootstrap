import type { ColSize } from './types';

export const getColSizeClasses = (infix: string, size: ColSize | null | undefined): string[] => {
  if (size === null || size === undefined || size === false) {
    return [];
  }
  if (size === true) {
    return [`col${infix}`];
  }

  const { offset, order, span } = typeof size === 'object' ? size : { span: size };
  const classes: string[] = [];

  if (span !== undefined) {
    classes.push(span === 'auto' ? `col${infix}-auto` : `col${infix}-${span}`);
  }
  if (order !== undefined) {
    classes.push(`order${infix}-${order}`);
  }
  if (offset !== undefined) {
    classes.push(`offset${infix}-${offset}`);
  }

  return classes;
};
