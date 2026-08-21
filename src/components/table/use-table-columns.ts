import { useCallback, useEffect, useMemo, useState } from 'react';

import type { TableColumnPreference, UseTableColumnsOptions, UseTableColumnsResult } from './types';

const readStoredColumns = (
  initialColumns: readonly TableColumnPreference[],
  storageKey: string | undefined,
): readonly TableColumnPreference[] | undefined => {
  if (typeof window === 'undefined' || !storageKey) {
    return undefined;
  }
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return undefined;
    }
    const parsed = JSON.parse(raw) as Partial<TableColumnPreference>[];
    if (!Array.isArray(parsed)) {
      return undefined;
    }
    return initialColumns.map((column) => {
      const stored = parsed.find((item) => item.key === column.key);
      if (!stored) {
        return column;
      }
      return {
        ...column,
        visible: stored.visible ?? column.visible,
        width: stored.width ?? column.width,
      };
    });
  } catch {
    return undefined;
  }
};

export const useTableColumns = ({
  initialColumns,
  storageKey,
}: UseTableColumnsOptions): UseTableColumnsResult => {
  const [columns, setColumns] = useState<readonly TableColumnPreference[]>(
    () => readStoredColumns(initialColumns, storageKey) ?? initialColumns,
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !storageKey) {
      return;
    }
    window.localStorage.setItem(storageKey, JSON.stringify(columns));
  }, [columns, storageKey]);

  const getColumn = useCallback(
    (key: string): TableColumnPreference | undefined =>
      columns.find((column) => column.key === key),
    [columns],
  );

  const reset = useCallback(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  const setColumnVisible = useCallback((key: string, visible: boolean) => {
    setColumns((previous) =>
      previous.map((column) => (column.key === key ? { ...column, visible } : column)),
    );
  }, []);

  const setColumnWidth = useCallback((key: string, width: number) => {
    setColumns((previous) =>
      previous.map((column) => (column.key === key ? { ...column, width } : column)),
    );
  }, []);

  const toggleColumn = useCallback((key: string) => {
    setColumns((previous) =>
      previous.map((column) =>
        column.key === key ? { ...column, visible: !column.visible } : column,
      ),
    );
  }, []);

  const visibleColumns = useMemo(() => columns.filter((column) => column.visible), [columns]);

  return {
    columns,
    getColumn,
    reset,
    setColumns,
    setColumnVisible,
    setColumnWidth,
    toggleColumn,
    visibleColumns,
    visibleCount: visibleColumns.length,
  };
};

export default useTableColumns;
