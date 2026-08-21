```typescript
export interface UseTableSearchOptions<Row> {
  fields?: readonly string[];
  initialQuery?: string;
  match?: (row: Row, query: string) => boolean;
}
```
