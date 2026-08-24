import { createContext, useContext } from 'react';

import type { AccordionContextValue, AccordionItemContextValue } from './types';

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export const useAccordion = () => useContext(AccordionContext);

export const useAccordionItem = () => useContext(AccordionItemContext);
