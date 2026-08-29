import { createContext, useContext } from 'react';

import type { TypographyContextValue } from './types';

export const TypographyContext = createContext<null | TypographyContextValue>(null);

export const useTypography = () => useContext(TypographyContext);
