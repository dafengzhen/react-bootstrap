import { useEffect, useRef, useState } from 'react';

/** Delay before the indicator shows up, so fast loads never flash it. */
export const LOADING_INDICATOR_DELAY = 200;

/** Shortest time the indicator stays visible once it has been shown. */
export const LOADING_INDICATOR_MIN_DURATION = 300;

/**
 * Turns a raw loading flag into a display flag: the loading indicator only
 * appears when loading takes longer than `LOADING_INDICATOR_DELAY`, and once
 * shown it stays visible for at least `LOADING_INDICATOR_MIN_DURATION`.
 */
export const useLoadingIndicator = (loading: boolean): boolean => {
  const [visible, setVisible] = useState(false);
  const shownAtRef = useRef(0);

  useEffect(() => {
    if (loading) {
      if (visible) {
        return undefined;
      }

      const timer = setTimeout(() => {
        shownAtRef.current = Date.now();
        setVisible(true);
      }, LOADING_INDICATOR_DELAY);

      return () => {
        clearTimeout(timer);
      };
    }

    if (!visible) {
      return undefined;
    }

    const remaining = LOADING_INDICATOR_MIN_DURATION - (Date.now() - shownAtRef.current);
    if (remaining <= 0) {
      setVisible(false);
      return undefined;
    }

    const timer = setTimeout(() => setVisible(false), remaining);

    return () => {
      clearTimeout(timer);
    };
  }, [loading, visible]);

  return visible;
};
