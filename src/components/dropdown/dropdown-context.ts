import { createContext, useContext } from 'react';

import type { DropdownContextValue } from './types';

export const DropdownContext = createContext<DropdownContextValue | null>(null);

export const useDropdown = () => useContext(DropdownContext);
