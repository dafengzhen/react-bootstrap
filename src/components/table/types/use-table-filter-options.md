```typescript
export interface UseTableFilterOptions<Row> {
  initialFilters?: Readonly<Record<string, unknown>>;
  predicate?: (row: Row, filters: Readonly<Record<string, unknown>>) => boolean;
}
```
