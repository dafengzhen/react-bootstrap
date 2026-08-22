import { useCallback, useEffect, useMemo, useState } from 'react';

import type { TableColumnPreference, UseTableColumnsOptions, UseTableColumnsResult } from './types';

interface StoredColumnPreference {
  key: string;
  visible?: boolean;
  width?: number;
}

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
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return undefined;
    }

    const storedColumns = new Map<string, StoredColumnPreference>();
    for (const value of parsed) {
      if (value === null || typeof value !== 'object') {
        continue;
      }
      const { key, visible, width } = value as Partial<StoredColumnPreference>;
      if (typeof key !== 'string') {
        continue;
      }
      storedColumns.set(key, {
        key,
        ...(typeof visible === 'boolean' ? { visible } : {}),
        ...(typeof width === 'number' && Number.isFinite(width) ? { width } : {}),
      });
    }

    return initialColumns.map((column) => {
      const stored = storedColumns.get(column.key);
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
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(columns));
    } catch {
      // Storage can be unavailable (for example, in private browsing mode).
    }
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
