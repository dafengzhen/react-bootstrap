import { createContext, useContext } from 'react';

import type { MenuContextValue } from './types';

export const MenuContext = createContext<MenuContextValue | null>(null);

export const useMenu = () => useContext(MenuContext);
