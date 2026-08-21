```typescript
export interface UseTableOptions<Row, Key> {
  getRowKey: (row: Row) => Key;
  initialRows?: readonly Row[];
}
```
