import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

let mediaQueryList: MediaQueryList | undefined;

const getMediaQueryList = (): MediaQueryList => {
  mediaQueryList ??= window.matchMedia(REDUCED_MOTION_QUERY);
  return mediaQueryList;
};

const subscribe = (onStoreChange: () => void): (() => void) => {
  const query = getMediaQueryList();
  query.addEventListener('change', onStoreChange);
  return () => query.removeEventListener('change', onStoreChange);
};

const getSnapshot = (): boolean => getMediaQueryList().matches;

const getServerSnapshot = (): boolean => false;

export const useReducedMotion = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
