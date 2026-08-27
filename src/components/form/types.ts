import type { ElementType, FormHTMLAttributes, HTMLAttributes } from 'react';

export interface FormGroupProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  controlId?: string;
}

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  validated?: boolean;
}
