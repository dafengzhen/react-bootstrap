import { useCallback, useState } from 'react';

import type {
  TableSortDirection,
  TableSortValue,
  UseTableSortingOptions,
  UseTableSortingResult,
} from './types';

const compareValues = (left: TableSortValue, right: TableSortValue): number => {
  if (left == null && right == null) {
    return 0;
  }
  if (left == null) {
    return 1;
  }
  if (right == null) {
    return -1;
  }
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }
  const leftText = String(left);
  const rightText = String(right);
  return leftText < rightText ? -1 : leftText > rightText ? 1 : 0;
};

const defaultGetValue = <Row>(row: Row, key: string): TableSortValue =>
  (row as Record<string, unknown>)[key] as TableSortValue;

export const useTableSorting = ({
  initialDirection = 'ascending',
  initialSortKey,
}: UseTableSortingOptions = {}): UseTableSortingResult => {
  const [sort, setSortState] = useState<{
    direction: TableSortDirection;
    key?: string;
  }>({ direction: initialDirection, key: initialSortKey });

  const clearSort = useCallback(() => {
    setSortState({ direction: 'ascending', key: undefined });
  }, []);

  const isActive = useCallback((key: string): boolean => sort.key === key, [sort.key]);

  const setSort = useCallback((key: string, direction?: TableSortDirection) => {
    setSortState((previous) => {
      if (direction) {
        return { direction, key };
      }
      if (previous.key === key) {
        return {
          direction: previous.direction === 'ascending' ? 'descending' : 'ascending',
          key,
        };
      }
      return { direction: 'ascending', key };
    });
  }, []);

  const sortRows = useCallback(
    <Row>(
      rows: readonly Row[],
      getValue: (row: Row, key: string) => TableSortValue = defaultGetValue,
    ): readonly Row[] => {
      const { direction, key } = sort;
      if (!key) {
        return rows;
      }
      const factor = direction === 'ascending' ? 1 : -1;
      return [...rows].sort(
        (left, right) => compareValues(getValue(left, key), getValue(right, key)) * factor,
      );
    },
    [sort],
  );

  const toggleSort = useCallback((key: string) => setSort(key), [setSort]);

  return {
    clearSort,
    direction: sort.direction,
    isActive,
    setSort,
    sortKey: sort.key,
    sortRows,
    toggleSort,
  };
};

export default useTableSorting;
