import { useCallback, useState } from 'react';

import type { UseTableEditingOptions, UseTableEditingResult } from './types';

export const useTableEditing = <Key>({
  defaultEditingKey = null,
  editingKey,
  onEditingKeyChange,
}: UseTableEditingOptions<Key> = {}): UseTableEditingResult<Key> => {
  const [internalKey, setInternalKey] = useState<Key | null>(defaultEditingKey);

  const currentKey = editingKey != null ? editingKey : internalKey;

  const cancelEdit = useCallback(() => {
    onEditingKeyChange?.(null);
    if (editingKey == null) {
      setInternalKey(null);
    }
  }, [editingKey, onEditingKeyChange]);

  const isEditing = useCallback(
    (key: Key) => currentKey != null && key === currentKey,
    [currentKey],
  );

  const startEdit = useCallback(
    (key: Key) => {
      onEditingKeyChange?.(key);
      if (editingKey == null) {
        setInternalKey(key);
      }
    },
    [editingKey, onEditingKeyChange],
  );

  return { cancelEdit, editingKey: currentKey, isEditing, startEdit };
};

export default useTableEditing;
