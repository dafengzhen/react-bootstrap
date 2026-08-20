import type { CSSProperties } from 'react';

import type { ProgressCssProperties } from './types';

const FULL_PERCENT = 100;

const PERCENT_PRECISION = 4;

export const resolveProgressHeight = (height: number | string): string =>
  typeof height === 'number' ? `${height}px` : height;

export const resolveProgressWidth = (now: number, min: number, max: number): string => {
  const range = max - min;

  if (!Number.isFinite(range) || range <= 0) {
    return '0%';
  }

  const ratio = ((now - min) / range) * FULL_PERCENT;
  const percent = Math.min(FULL_PERCENT, Math.max(0, Number.isFinite(ratio) ? ratio : 0));

  return `${Number.parseFloat(percent.toFixed(PERCENT_PRECISION))}%`;
};

export const mergeProgressStyle = (
  style: CSSProperties | undefined,
  height: number | string | undefined,
  width: string | undefined,
): ProgressCssProperties | undefined => {
  if (height === undefined && width === undefined) {
    return style;
  }

  return {
    ...(width === undefined ? undefined : { width }),
    ...(height === undefined
      ? undefined
      : { '--bs-progress-height': resolveProgressHeight(height) }),
    ...style,
  };
};
