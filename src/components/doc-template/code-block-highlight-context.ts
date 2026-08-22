import { createContext, useContext } from 'react';

import type { HighlightElement } from './types.ts';

export const CodeBlockHighlightContext = createContext<HighlightElement | null>(null);

export const useCodeBlockHighlight = (): HighlightElement | null =>
  useContext(CodeBlockHighlightContext);
