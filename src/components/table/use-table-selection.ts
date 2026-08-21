import { useCallback, useState } from 'react';

import type { UseTableSelectionOptions, UseTableSelectionResult } from './types';

export const useTableSelection = <Key>({
  initialSelectedKeys,
}: UseTableSelectionOptions<Key> = {}): UseTableSelectionResult<Key> => {
  const [selectedKeys, setSelectedKeysState] = useState<ReadonlySet<Key>>(
    () => new Set(initialSelectedKeys),
  );

  const clear = useCallback(() => {
    setSelectedKeysState(new Set());
  }, []);

  const deselect = useCallback((key: Key) => {
    setSelectedKeysState((previous) => {
      if (!previous.has(key)) {
        return previous;
      }
      const next = new Set(previous);
      next.delete(key);
      return next;
    });
  }, []);

  const isAllSelected = useCallback(
    (keys: Iterable<Key>) => {
      const keyList = [...keys];
      return keyList.length > 0 && keyList.every((key) => selectedKeys.has(key));
    },
    [selectedKeys],
  );

  const isIndeterminate = useCallback(
    (keys: Iterable<Key>) => {
      const keyList = [...keys];
      const selected = keyList.filter((key) => selectedKeys.has(key)).length;
      return selected > 0 && selected < keyList.length;
    },
    [selectedKeys],
  );

  const isSelected = useCallback((key: Key) => selectedKeys.has(key), [selectedKeys]);

  const select = useCallback((key: Key) => {
    setSelectedKeysState((previous) => {
      if (previous.has(key)) {
        return previous;
      }
      const next = new Set(previous);
      next.add(key);
      return next;
    });
  }, []);

  const selectAll = useCallback((keys: Iterable<Key>) => {
    setSelectedKeysState((previous) => {
      const next = new Set(previous);
      for (const key of keys) {
        next.add(key);
      }
      return next;
    });
  }, []);

  const setSelectedKeys = useCallback((keys: Iterable<Key>) => {
    setSelectedKeysState(new Set(keys));
  }, []);

  const toggle = useCallback((key: Key) => {
    setSelectedKeysState((previous) => {
      const next = new Set(previous);
      if (!next.delete(key)) {
        next.add(key);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback((keys: Iterable<Key>) => {
    setSelectedKeysState((previous) => {
      const keyList = [...keys];
      const allSelected = keyList.length > 0 && keyList.every((key) => previous.has(key));
      const next = new Set(previous);
      for (const key of keyList) {
        if (allSelected) {
          next.delete(key);
        } else {
          next.add(key);
        }
      }
      return next;
    });
  }, []);

  return {
    clear,
    deselect,
    isAllSelected,
    isIndeterminate,
    isSelected,
    select,
    selectAll,
    selectedCount: selectedKeys.size,
    selectedKeys,
    setSelectedKeys,
    toggle,
    toggleAll,
  };
};

export default useTableSelection;
