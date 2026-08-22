import clsx from 'clsx';

import type { PlaceholderAnimation, PlaceholderBg, PlaceholderSize } from './types';

type PlaceholderColumnWidth = 'auto' | boolean | number;

export const resolvePlaceholderClassName = (
  className: string | undefined,
  animation: PlaceholderAnimation | undefined,
  bg: PlaceholderBg | undefined,
  size: PlaceholderSize | undefined,
  xs: PlaceholderColumnWidth | undefined,
): string =>
  clsx(
    animation ? `placeholder-${animation}` : 'placeholder',
    bg && `bg-${bg}`,
    size && `placeholder-${size}`,
    xs === 'auto' ? 'col-auto' : typeof xs === 'number' ? `col-${xs}` : xs && 'col',
    className,
  );
