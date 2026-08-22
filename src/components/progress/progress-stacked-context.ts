import { createContext, useContext } from 'react';

import type { ProgressStackedContextValue } from './types';

export const ProgressStackedContext = createContext<null | ProgressStackedContextValue>(null);

export const useProgressStacked = () => useContext(ProgressStackedContext);
