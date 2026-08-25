import { createContext, useContext } from 'react';

import type { SplitterContextValue } from './types';

export const SplitterContext = createContext<null | SplitterContextValue>(null);

export const useSplitter = (): null | SplitterContextValue => useContext(SplitterContext);
