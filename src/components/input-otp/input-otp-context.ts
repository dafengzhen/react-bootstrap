import { createContext, useContext } from 'react';

import type { InputOtpContextValue } from './types';

export const InputOtpContext = createContext<InputOtpContextValue | null>(null);

export const useInputOtp = (): InputOtpContextValue | null => useContext(InputOtpContext);
