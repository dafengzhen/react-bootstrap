import type { ElementType, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export interface FormControlProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  as?: ElementType;
  htmlSize?: number;
  isInvalid?: boolean;
  isValid?: boolean;
  plaintext?: boolean;
  size?: FormControlSize;
  type?: string;
}

export type FormControlSize = 'lg' | 'sm';

export interface FormTextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  muted?: boolean;
}
