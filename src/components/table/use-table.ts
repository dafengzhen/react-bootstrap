import { useCallback, useMemo, useState } from 'react';

import type { UseTableOptions, UseTableResult } from './types';

const normalizeInsertionIndex = (index: number, length: number): number => {
  if (!Number.isFinite(index)) {
    return length;
  }
  return Math.min(Math.max(Math.trunc(index), 0), length);
};

export const useTable = <Row, Key>({
  getRowKey,
  initialRows = [],
}: UseTableOptions<Row, Key>): UseTableResult<Row, Key> => {
  const [rows, setRows] = useState<readonly Row[]>(initialRows);

  const keys = useMemo(() => rows.map(getRowKey), [getRowKey, rows]);

  const addRow = useCallback((row: Row, index?: number) => {
    setRows((previous) => {
      if (index === undefined) {
        return [...previous, row];
      }
      const insertionIndex = normalizeInsertionIndex(index, previous.length);
      return [...previous.slice(0, insertionIndex), row, ...previous.slice(insertionIndex)];
    });
  }, []);

  const clear = useCallback(() => {
    setRows([]);
  }, []);

  const removeRow = useCallback(
    (key: Key) => {
      setRows((previous) => previous.filter((row) => getRowKey(row) !== key));
    },
    [getRowKey],
  );

  const removeRows = useCallback(
    (keysToRemove: Iterable<Key>) => {
      const removeSet = new Set(keysToRemove);
      setRows((previous) => previous.filter((row) => !removeSet.has(getRowKey(row))));
    },
    [getRowKey],
  );

  const updateRow = useCallback(
    (key: Key, updater: (row: Row) => Row) => {
      setRows((previous) => previous.map((row) => (getRowKey(row) === key ? updater(row) : row)));
    },
    [getRowKey],
  );

  return { addRow, clear, getRowKey, keys, removeRow, removeRows, rows, setRows, updateRow };
};

export default useTable;
