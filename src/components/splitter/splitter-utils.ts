import type { SplitterSize } from './types';

export interface SplitterSizeParts {
  unit: 'percent' | 'px';
  value: number;
}

const SPLITTER_SIZE_PATTERN = /^\s*(\d+(?:\.\d+)?)\s*(px|%)?\s*$/i;

export const clampValue = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const computeSplitterPanelPx = (
  sizes: SplitterSize[],
  total: number,
  barSize: number,
): number[] => {
  const available = Math.max(total - barSize * (sizes.length - 1), 0);
  const resolved = sizes.map((size): null | number => {
    const parts = parseSplitterSize(size);
    if (parts === null) {
      return null;
    }
    return parts.unit === 'percent' ? (parts.value / 100) * total : parts.value;
  });
  const fixedSum = resolved.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  const autoCount = resolved.filter((value) => value === null).length;
  const autoSize = autoCount > 0 ? Math.max(available - fixedSum, 0) / autoCount : 0;
  return resolved.map((value) => value ?? autoSize);
};

export const isAutoSplitterSize = (size: null | SplitterSize | undefined): boolean => {
  if (size === null || size === undefined) {
    return true;
  }
  if (typeof size === 'number') {
    return false;
  }
  const trimmed = size.trim();
  return trimmed === '' || trimmed.toLowerCase() === 'auto';
};

export const normalizeSplitterSizes = (sizes: SplitterSize[], count: number): SplitterSize[] =>
  Array.from({ length: count }, (_, index) => sizes[index] ?? 'auto');

export const parseSplitterSize = (size: SplitterSize | undefined): null | SplitterSizeParts => {
  if (typeof size === 'number') {
    return Number.isFinite(size) ? { unit: 'px', value: size } : null;
  }
  if (typeof size !== 'string') {
    return null;
  }
  const match = SPLITTER_SIZE_PATTERN.exec(size.trim());
  if (match === null) {
    return null;
  }
  return {
    unit: match[2]?.toLowerCase() === '%' ? 'percent' : 'px',
    value: Number(match[1]),
  };
};

export const pxToSplitterSize = (
  px: number,
  original: SplitterSize | undefined,
  total: number,
): SplitterSize => {
  const parts = parseSplitterSize(original);
  if (parts?.unit === 'percent' && total > 0) {
    return `${roundTo((px / total) * 100, 2)}%`;
  }
  if (parts?.unit === 'px' && typeof original === 'string') {
    return `${roundTo(px, 2)}px`;
  }
  return roundTo(px, 2);
};

export const roundTo = (value: number, digits: number): number => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export const splitterSizeToCss = (size: null | SplitterSize | undefined): string =>
  typeof size === 'number' ? `${size}px` : (size ?? 'auto');

export const splitterSizeToPx = (size: number | string, total: number): number => {
  const parts = parseSplitterSize(size);
  if (parts === null) {
    return 0;
  }
  return parts.unit === 'percent' ? (parts.value / 100) * total : parts.value;
};
