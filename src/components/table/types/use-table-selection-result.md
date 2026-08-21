```typescript
export interface UseTableSelectionResult<Key> {
  clear: () => void;
  deselect: (key: Key) => void;
  isAllSelected: (keys: Iterable<Key>) => boolean;
  isIndeterminate: (keys: Iterable<Key>) => boolean;
  isSelected: (key: Key) => boolean;
  select: (key: Key) => void;
  selectAll: (keys: Iterable<Key>) => void;
  selectedCount: number;
  selectedKeys: ReadonlySet<Key>;
  setSelectedKeys: (keys: Iterable<Key>) => void;
  toggle: (key: Key) => void;
  toggleAll: (keys: Iterable<Key>) => void;
}
```
