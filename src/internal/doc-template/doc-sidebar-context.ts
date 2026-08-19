import { createContext, useContext } from 'react';

import type { TocItem } from './types.ts';

interface DocSidebarContextValue {
  registerSections: (items: TocItem[]) => () => void;
}

export const DocSidebarContext = createContext<DocSidebarContextValue | null>(null);

export const useDocSidebar = (): DocSidebarContextValue | null => useContext(DocSidebarContext);
