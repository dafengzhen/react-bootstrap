import { createContext, useContext } from 'react';

import type { ScrollSpyContextValue } from './types';

export const ScrollSpyContext = createContext<null | ScrollSpyContextValue>(null);

export const useScrollSpy = () => useContext(ScrollSpyContext);
