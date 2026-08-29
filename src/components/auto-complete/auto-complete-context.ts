import { createContext, useContext } from 'react';

import type { AutoCompleteContextValue } from './types';

export const AutoCompleteContext = createContext<AutoCompleteContextValue | null>(null);

export const useAutoComplete = (): AutoCompleteContextValue => {
  const context = useContext(AutoCompleteContext);
  if (!context) {
    throw new Error('useAutoComplete must be used within an AutoComplete component.');
  }
  return context;
};

export default AutoCompleteContext;
