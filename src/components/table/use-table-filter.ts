import { useCallback, useState } from 'react';

import type { UseTableFilterOptions, UseTableFilterResult } from './types';

const defaultPredicate = <Row>(row: Row, filters: Readonly<Record<string, unknown>>): boolean =>
  Object.entries(filters).every(([key, value]) => {
    if (
      value == null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return true;
    }
    const rowValue = (row as Record<string, unknown>)[key];
    if (Array.isArray(value)) {
      return value.some((item) => String(item) === String(rowValue));
    }
    return String(value) === String(rowValue);
  });

export const useTableFilter = <Row>({
  initialFilters,
  predicate,
}: UseTableFilterOptions<Row> = {}): UseTableFilterResult<Row> => {
  const [filters, setFiltersState] = useState<Readonly<Record<string, unknown>>>(() => ({
    ...initialFilters,
  }));

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  const filterRows = useCallback(
    (rows: readonly Row[]): readonly Row[] => {
      if (Object.keys(filters).length === 0) {
        return rows;
      }
      return rows.filter((row) => (predicate ?? defaultPredicate)(row, filters));
    },
    [filters, predicate],
  );

  const hasFilter = useCallback((key: string): boolean => key in filters, [filters]);

  const removeFilter = useCallback((key: string) => {
    setFiltersState((previous) => {
      if (!(key in previous)) {
        return previous;
      }
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }, []);

  const setFilter = useCallback((key: string, value: unknown) => {
    setFiltersState((previous) => {
      const next = { ...previous };
      if (value == null || (typeof value === 'string' && value.trim() === '')) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  }, []);

  const setFilters = useCallback((next: Readonly<Record<string, unknown>>) => {
    setFiltersState({ ...next });
  }, []);

  return {
    clearFilters,
    filterCount: Object.keys(filters).length,
    filterRows,
    filters,
    hasFilter,
    hasFilters: Object.keys(filters).length > 0,
    removeFilter,
    setFilter,
    setFilters,
  };
};

export default useTableFilter;
