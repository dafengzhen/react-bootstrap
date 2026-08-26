import { createContext, useContext } from 'react';

import type { TimelineContextValue } from './types';

export const TimelineContext = createContext<null | TimelineContextValue>(null);

export const useTimeline = () => useContext(TimelineContext);
