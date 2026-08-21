import { useCallback, useState } from 'react';

import type { UseTableSearchOptions, UseTableSearchResult } from './types';

export const useTableSearch = <Row>({
  fields,
  initialQuery = '',
  match,
}: UseTableSearchOptions<Row> = {}): UseTableSearchResult<Row> => {
  const [query, setQuery] = useState(initialQuery);
  const trimmedQuery = query.trim().toLowerCase();

  const matches = useCallback(
    (row: Row): boolean => {
      if (!trimmedQuery) {
        return true;
      }
      if (match) {
        return match(row, trimmedQuery);
      }
      if (fields && fields.length > 0) {
        return fields.some((field) =>
          String((row as Record<string, unknown>)[field] ?? '')
            .toLowerCase()
            .includes(trimmedQuery),
        );
      }
      return Object.values(row as Record<string, unknown>).some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(trimmedQuery),
      );
    },
    [fields, match, trimmedQuery],
  );

  const searchRows = useCallback(
    (rows: readonly Row[]): readonly Row[] => rows.filter(matches),
    [matches],
  );

  const clear = useCallback(() => {
    setQuery('');
  }, []);

  return { clear, hasQuery: query.trim() !== '', matches, query, searchRows, setQuery };
};

export default useTableSearch;
