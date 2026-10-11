import { createContext, useContext } from 'react';

import type { RichTextEditorContextValue } from './types';

/**
 * The editor every control inside the component reads.
 *
 * It is `null` outside a `RichTextEditor`, which is what lets a toolbar be composed by hand: a
 * control that finds no context renders nothing rather than throwing, and the `useRichTextEditor`
 * hook is the version that throws, for the code that has to have an editor.
 */
export const RichTextEditorContext = createContext<null | RichTextEditorContextValue>(null);

/** The editor of the surrounding component; throws when there is none. */
export function useRichTextEditor(): RichTextEditorContextValue {
  const context = useContext(RichTextEditorContext);

  if (!context) {
    throw new Error('RichTextEditor: this hook must be used inside a <RichTextEditor>');
  }

  return context;
}

/** The editor of the surrounding component, or `null` outside one. */
export function useRichTextEditorContext(): null | RichTextEditorContextValue {
  return useContext(RichTextEditorContext);
}
