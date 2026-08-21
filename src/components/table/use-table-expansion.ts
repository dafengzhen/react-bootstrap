import { useCallback, useState } from 'react';

import type { UseTableExpansionOptions, UseTableExpansionResult } from './types';

export const useTableExpansion = <Key>({
  initialExpandedKeys,
}: UseTableExpansionOptions<Key> = {}): UseTableExpansionResult<Key> => {
  const [expandedKeys, setExpandedKeysState] = useState<ReadonlySet<Key>>(
    () => new Set(initialExpandedKeys),
  );

  const collapse = useCallback((key: Key) => {
    setExpandedKeysState((previous) => {
      if (!previous.has(key)) {
        return previous;
      }
      const next = new Set(previous);
      next.delete(key);
      return next;
    });
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedKeysState(new Set());
  }, []);

  const expand = useCallback((key: Key) => {
    setExpandedKeysState((previous) => {
      if (previous.has(key)) {
        return previous;
      }
      const next = new Set(previous);
      next.add(key);
      return next;
    });
  }, []);

  const expandAll = useCallback((keys: Iterable<Key>) => {
    setExpandedKeysState((previous) => {
      const next = new Set(previous);
      for (const key of keys) {
        next.add(key);
      }
      return next;
    });
  }, []);

  const isExpanded = useCallback((key: Key) => expandedKeys.has(key), [expandedKeys]);

  const setExpandedKeys = useCallback((keys: Iterable<Key>) => {
    setExpandedKeysState(new Set(keys));
  }, []);

  const toggle = useCallback((key: Key) => {
    setExpandedKeysState((previous) => {
      const next = new Set(previous);
      if (!next.delete(key)) {
        next.add(key);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback((keys: Iterable<Key>) => {
    setExpandedKeysState((previous) => {
      const keyList = [...keys];
      const allExpanded = keyList.length > 0 && keyList.every((key) => previous.has(key));
      const next = new Set(previous);
      for (const key of keyList) {
        if (allExpanded) {
          next.delete(key);
        } else {
          next.add(key);
        }
      }
      return next;
    });
  }, []);

  return {
    collapse,
    collapseAll,
    expand,
    expandAll,
    expandedCount: expandedKeys.size,
    expandedKeys,
    isExpanded,
    setExpandedKeys,
    toggle,
    toggleAll,
  };
};

export default useTableExpansion;
