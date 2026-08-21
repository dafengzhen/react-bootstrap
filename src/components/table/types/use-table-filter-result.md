```typescript
export interface UseTableFilterResult<Row> {
  clearFilters: () => void;
  filterCount: number;
  filterRows: (rows: readonly Row[]) => readonly Row[];
  filters: Readonly<Record<string, unknown>>;
  hasFilter: (key: string) => boolean;
  hasFilters: boolean;
  removeFilter: (key: string) => void;
  setFilter: (key: string, value: unknown) => void;
  setFilters: (filters: Readonly<Record<string, unknown>>) => void;
}
```
