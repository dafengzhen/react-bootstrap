import type { ElementType, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface InputGroupCheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  className?: string;
}

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  hasValidation?: boolean;
  size?: InputGroupSize;
}

export interface InputGroupRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
}

export type InputGroupSize = 'lg' | 'sm';

export interface InputGroupTextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  htmlFor?: string;
}
