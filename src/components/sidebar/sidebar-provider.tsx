import type { FC } from 'react';

import type { SidebarProviderProps } from './types';

import { SidebarContext } from './sidebar-context';
import { useSidebarState } from './use-sidebar-state';

export const SidebarProvider: FC<SidebarProviderProps> = ({ children, ...stateProps }) => {
  const contextValue = useSidebarState(stateProps);

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>;
};

export default SidebarProvider;
