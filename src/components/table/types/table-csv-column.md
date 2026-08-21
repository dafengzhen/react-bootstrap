```typescript
export interface TableCsvColumn<Row> {
  key: string;
  label?: string;
  value?: (row: Row) => number | string | undefined;
}
```
