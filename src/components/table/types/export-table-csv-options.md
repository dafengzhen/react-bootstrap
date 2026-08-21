```typescript
export interface ExportTableCsvOptions<Row> {
  columns: readonly TableCsvColumn<Row>[];
  filename?: string;
  rows: readonly Row[];
}
```
