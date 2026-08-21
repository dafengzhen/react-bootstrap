```typescript
export interface UseTableEditingResult<Key> {
  cancelEdit: () => void;
  editingKey: Key | null;
  isEditing: (key: Key) => boolean;
  startEdit: (key: Key) => void;
}
```
