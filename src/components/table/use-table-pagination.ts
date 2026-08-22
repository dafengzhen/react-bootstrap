import { useCallback, useState } from 'react';

import type { UseTablePaginationOptions, UseTablePaginationResult } from './types';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

const normalizePositiveInteger = (value: number, fallback: number): number =>
  Number.isFinite(value) ? Math.max(Math.trunc(value), 1) : fallback;

const normalizeTotalCount = (value: number): number =>
  Number.isFinite(value) ? Math.max(Math.trunc(value), 0) : 0;

const clampPage = (page: number, totalPages: number): number => {
  const safePage = normalizePositiveInteger(page, 1);
  return Math.min(safePage, normalizePositiveInteger(totalPages, 1));
};

export const useTablePagination = ({
  initialPage = 1,
  initialPageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  totalCount = 0,
}: UseTablePaginationOptions = {}): UseTablePaginationResult => {
  const [page, setPageState] = useState(() => normalizePositiveInteger(initialPage, 1));
  const [pageSize, setPageSizeState] = useState(() =>
    normalizePositiveInteger(initialPageSize, 10),
  );

  const totalPages = Math.max(1, Math.ceil(normalizeTotalCount(totalCount) / pageSize));
  const currentPage = clampPage(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const setPage = useCallback(
    (next: number) => {
      setPageState(clampPage(next, totalPages));
    },
    [totalPages],
  );

  const setPageSize = useCallback((next: number) => {
    setPageSizeState(normalizePositiveInteger(next, 1));
    setPageState(1);
  }, []);

  const nextPage = useCallback(() => {
    setPageState((previous) => clampPage(clampPage(previous, totalPages) + 1, totalPages));
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setPageState((previous) => clampPage(clampPage(previous, totalPages) - 1, totalPages));
  }, [totalPages]);

  const firstPage = useCallback(() => {
    setPageState(1);
  }, []);

  const lastPage = useCallback(() => {
    setPageState(totalPages);
  }, [totalPages]);

  const getPageRows = useCallback(
    <Row>(rows: readonly Row[]): readonly Row[] => rows.slice(startIndex, endIndex),
    [endIndex, startIndex],
  );

  return {
    endIndex,
    firstPage,
    getPageRows,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    lastPage,
    nextPage,
    page: currentPage,
    pageSize,
    pageSizeOptions,
    previousPage,
    setPage,
    setPageSize,
    startIndex,
    totalPages,
  };
};

export default useTablePagination;
