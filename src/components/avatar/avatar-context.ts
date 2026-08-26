import { createContext, useContext } from 'react';

import type { AvatarGroupContextValue } from './types';

export const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);

export const useAvatarGroup = () => useContext(AvatarGroupContext);
