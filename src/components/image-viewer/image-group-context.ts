import { createContext, useContext } from 'react';

import type { ImageGroupContextValue } from './types';

export const ImageGroupContext = createContext<ImageGroupContextValue | null>(null);

export const useImageGroup = (): ImageGroupContextValue | null => useContext(ImageGroupContext);
