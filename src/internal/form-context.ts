import { createContext, useContext } from 'react';

export interface FormContextValue {
  controlId?: string;
}

export const FormContext = createContext<FormContextValue | null>(null);

export const useFormContext = () => useContext(FormContext);
