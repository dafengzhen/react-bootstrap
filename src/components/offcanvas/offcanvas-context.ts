import { createContext, useContext } from 'react';

import type { OffcanvasContextValue } from './types';

export const OffcanvasContext = createContext<null | OffcanvasContextValue>(null);

export const useOffcanvas = () => {
  const context = useContext(OffcanvasContext);
  if (!context) {
    throw new Error('Offcanvas parts must be used within Offcanvas.');
  }
  return context;
};
