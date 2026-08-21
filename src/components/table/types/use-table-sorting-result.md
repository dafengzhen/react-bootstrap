```typescript
export interface UseTableSortingResult {
  clearSort: () => void;
  direction: TableSortDirection;
  isActive: (key: string) => boolean;
  setSort: (key: string, direction?: TableSortDirection) => void;
  sortKey: string | undefined;
  sortRows: <Row>(
    rows: readonly Row[],
    getValue?: (row: Row, key: string) => TableSortValue,
  ) => readonly Row[];
  toggleSort: (key: string) => void;
}
```
