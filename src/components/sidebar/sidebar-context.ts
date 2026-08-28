import { createContext, useContext } from 'react';

import type { SidebarContextValue } from './types';

export const SidebarContext = createContext<null | SidebarContextValue>(null);

export const useSidebar = (): null | SidebarContextValue => useContext(SidebarContext);

export const useSidebarRequired = (): SidebarContextValue => {
  const context = useContext(SidebarContext);
  if (context === null) {
    throw new Error('Sidebar parts must be used within Sidebar.');
  }
  return context;
};
