import { createContext, useContext } from 'react';

import type { ModalContextValue } from './types';

export const ModalContext = createContext<ModalContextValue | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal parts must be used within Modal.');
  }
  return context;
};
