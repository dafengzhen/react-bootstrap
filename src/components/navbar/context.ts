import { createContext, useContext } from 'react';

import type { NavbarContextValue } from './types';

export const NavbarContext = createContext<NavbarContextValue | null>(null);

export const useNavbar = () => useContext(NavbarContext);
