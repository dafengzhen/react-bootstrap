import { useCallback, useSyncExternalStore } from 'react';

const mediaQueryLists = new Map<string, MediaQueryList>();

const getMediaQueryList = (query: string): MediaQueryList => {
  let mediaQueryList = mediaQueryLists.get(query);
  if (mediaQueryList === undefined) {
    mediaQueryList = window.matchMedia(query);
    mediaQueryLists.set(query, mediaQueryList);
  }
  return mediaQueryList;
};

export const useMediaQuery = (query: string, defaultValue = false): boolean => {
  const subscribe = useCallback(
    (onStoreChange: () => void): (() => void) => {
      const mediaQueryList = getMediaQueryList(query);
      mediaQueryList.addEventListener('change', onStoreChange);
      return () => mediaQueryList.removeEventListener('change', onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback((): boolean => getMediaQueryList(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => defaultValue);
};

export default useMediaQuery;
