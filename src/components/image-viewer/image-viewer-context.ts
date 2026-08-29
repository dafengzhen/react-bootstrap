import { createContext, useContext } from 'react';

import type { ImageViewerContextValue } from './types';

export const ImageViewerContext = createContext<ImageViewerContextValue | null>(null);

export const useImageViewer = (): ImageViewerContextValue | null => useContext(ImageViewerContext);
