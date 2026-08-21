```typescript
export interface UseTableSearchResult<Row> {
  clear: () => void;
  hasQuery: boolean;
  matches: (row: Row) => boolean;
  query: string;
  searchRows: (rows: readonly Row[]) => readonly Row[];
  setQuery: (query: string) => void;
}
```
