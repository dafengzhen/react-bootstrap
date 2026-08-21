import type { HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from 'react';

export interface FormCheckInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  indeterminate?: boolean;
  isInvalid?: boolean;
  isValid?: boolean;
  type?: 'checkbox' | 'radio';
}

export interface FormCheckLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export interface FormCheckProps extends HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
  reverse?: boolean;
  type?: FormCheckType;
}

export type FormCheckType = 'checkbox' | 'radio' | 'switch';
