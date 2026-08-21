```typescript
export interface UseTableExpansionResult<Key> {
  collapse: (key: Key) => void;
  collapseAll: () => void;
  expand: (key: Key) => void;
  expandAll: (keys: Iterable<Key>) => void;
  expandedCount: number;
  expandedKeys: ReadonlySet<Key>;
  isExpanded: (key: Key) => boolean;
  setExpandedKeys: (keys: Iterable<Key>) => void;
  toggle: (key: Key) => void;
  toggleAll: (keys: Iterable<Key>) => void;
}
```
