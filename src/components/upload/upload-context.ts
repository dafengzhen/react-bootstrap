import { createContext, useContext } from 'react';

import type { UploadContextValue } from './types';

export const UploadContext = createContext<null | UploadContextValue>(null);

export const useUpload = (): null | UploadContextValue => useContext(UploadContext);
