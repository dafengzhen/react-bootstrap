import { createContext, useContext } from 'react';

import type { NavContextValue, TabsContextValue } from './types';

export const NavContext = createContext<NavContextValue | null>(null);

export const TabsContext = createContext<null | TabsContextValue>(null);

export const useNav = () => useContext(NavContext);

export const useTabs = () => useContext(TabsContext);
