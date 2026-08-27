import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  ScrollShadowVisibility,
  UseScrollShadowOptions,
  UseScrollShadowResult,
} from './types';

import {
  computeScrollShadowVisibility,
  EMPTY_VISIBILITY,
  isVisibilityEqual,
} from './scroll-shadow-utils';

export const useScrollShadow = <T extends HTMLElement = HTMLElement>(
  options: UseScrollShadowOptions = {},
): UseScrollShadowResult<T> => {
  const { direction = 'vertical', disabled = false, onChange } = options;

  const [element, setElement] = useState<null | T>(null);
  const [visibility, setVisibility] = useState<ScrollShadowVisibility>(EMPTY_VISIBILITY);

  const onChangeRef = useRef(onChange);
  const visibilityRef = useRef<ScrollShadowVisibility>(EMPTY_VISIBILITY);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const ref = useCallback((node: null | T) => {
    setElement(node);
  }, []);

  useEffect(() => {
    const applyVisibility = (next: ScrollShadowVisibility) => {
      if (isVisibilityEqual(next, visibilityRef.current)) {
        return;
      }

      visibilityRef.current = next;
      setVisibility(next);
      onChangeRef.current?.(next);
    };

    if (disabled) {
      applyVisibility(EMPTY_VISIBILITY);
      return;
    }

    if (!element) {
      applyVisibility(EMPTY_VISIBILITY);
      return;
    }

    const isRtl = getComputedStyle(element).direction === 'rtl';

    const update = () => {
      applyVisibility(computeScrollShadowVisibility(element, direction, isRtl));
    };

    update();

    element.addEventListener('scroll', update, { passive: true });

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener('scroll', update);
      resizeObserver.disconnect();
    };
  }, [direction, disabled, element]);

  return { ref, visibility };
};
