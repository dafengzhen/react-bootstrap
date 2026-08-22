import { createContext, useContext } from 'react';

import type { ToastContextValue } from './types';

export const ToastContext = createContext<null | ToastContextValue>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('Toast parts must be used within Toast.');
  }
  return context;
};
