```typescript
export interface UseTableColumnsResult {
  columns: readonly TableColumnPreference[];
  getColumn: (key: string) => TableColumnPreference | undefined;
  reset: () => void;
  setColumns: (columns: readonly TableColumnPreference[]) => void;
  setColumnVisible: (key: string, visible: boolean) => void;
  setColumnWidth: (key: string, width: number) => void;
  toggleColumn: (key: string) => void;
  visibleColumns: readonly TableColumnPreference[];
  visibleCount: number;
}
```
