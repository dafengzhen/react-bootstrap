```typescript
export interface UseTableEditingOptions<Key> {
  defaultEditingKey?: Key | null;
  editingKey?: Key | null;
  onEditingKeyChange?: (key: Key | null) => void;
}
```
