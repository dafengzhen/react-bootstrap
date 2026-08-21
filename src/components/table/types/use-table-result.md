```typescript
export interface UseTableResult<Row, Key> {
  addRow: (row: Row, index?: number) => void;
  clear: () => void;
  getRowKey: (row: Row) => Key;
  keys: readonly Key[];
  removeRow: (key: Key) => void;
  removeRows: (keys: Iterable<Key>) => void;
  rows: readonly Row[];
  setRows: (rows: readonly Row[]) => void;
  updateRow: (key: Key, updater: (row: Row) => Row) => void;
}
```
