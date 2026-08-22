import type { ColProps, ColSize } from './types';

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

export const getColClasses = (
  sizes: Pick<ColProps, 'lg' | 'md' | 'sm' | 'xl' | 'xs' | 'xxl'>,
): string[] => [
  ...getColSizeClasses('', sizes.xs),
  ...getColSizeClasses('-sm', sizes.sm),
  ...getColSizeClasses('-md', sizes.md),
  ...getColSizeClasses('-lg', sizes.lg),
  ...getColSizeClasses('-xl', sizes.xl),
  ...getColSizeClasses('-xxl', sizes.xxl),
];
