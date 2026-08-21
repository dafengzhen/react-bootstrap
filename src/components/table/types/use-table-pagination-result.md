```typescript
export interface UseTablePaginationResult {
  endIndex: number;
  firstPage: () => void;
  getPageRows: <Row>(rows: readonly Row[]) => readonly Row[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  lastPage: () => void;
  nextPage: () => void;
  page: number;
  pageSize: number;
  pageSizeOptions: readonly number[];
  previousPage: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  startIndex: number;
  totalPages: number;
}
```
