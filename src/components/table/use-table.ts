import { useCallback, useMemo, useState } from 'react';

import type { UseTableOptions, UseTableResult } from './types';

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
      return [...previous.slice(0, index), row, ...previous.slice(index)];
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
