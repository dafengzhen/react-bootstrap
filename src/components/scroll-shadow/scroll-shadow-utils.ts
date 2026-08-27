import type { ScrollShadowDirection, ScrollShadowVisibility } from './types';

const SCROLL_EDGE_TOLERANCE = 1;

export const EMPTY_VISIBILITY: ScrollShadowVisibility = {
  bottom: false,
  left: false,
  right: false,
  top: false,
};

export const isScrollAxisTracked = (
  direction: ScrollShadowDirection,
  axis: 'horizontal' | 'vertical',
): boolean => direction === 'both' || direction === axis;

export const isVisibilityEqual = (
  current: ScrollShadowVisibility,
  next: ScrollShadowVisibility,
): boolean =>
  current.top === next.top &&
  current.bottom === next.bottom &&
  current.left === next.left &&
  current.right === next.right;

export const computeScrollShadowVisibility = (
  element: HTMLElement,
  direction: ScrollShadowDirection,
  isRtl: boolean,
): ScrollShadowVisibility => {
  const { clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth } = element;

  let bottom = false;
  let left = false;
  let right = false;
  let top = false;

  if (isScrollAxisTracked(direction, 'vertical')) {
    top = scrollTop > SCROLL_EDGE_TOLERANCE;
    bottom = scrollHeight - clientHeight - scrollTop > SCROLL_EDGE_TOLERANCE;
  }

  if (isScrollAxisTracked(direction, 'horizontal')) {
    if (isRtl) {
      right = scrollLeft < -SCROLL_EDGE_TOLERANCE;
      left = scrollLeft > clientWidth - scrollWidth + SCROLL_EDGE_TOLERANCE;
    } else {
      left = scrollLeft > SCROLL_EDGE_TOLERANCE;
      right = scrollWidth - clientWidth - scrollLeft > SCROLL_EDGE_TOLERANCE;
    }
  }

  return {
    bottom,
    left,
    right,
    top,
  };
};
