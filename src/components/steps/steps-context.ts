import { createContext, useContext } from 'react';

import type { StepsContextValue } from './types';

export const StepsContext = createContext<null | StepsContextValue>(null);

export const useSteps = () => useContext(StepsContext);
