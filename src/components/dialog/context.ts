import { createContext, useContext } from 'react';

import type { DialogContextValue } from './types';

export const DialogContext = createContext<DialogContextValue | null>(null);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog parts must be used within Dialog.');
  }
  return context;
};
