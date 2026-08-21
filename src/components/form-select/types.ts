import type { SelectHTMLAttributes } from 'react';

export interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  htmlSize?: number;
  isInvalid?: boolean;
  isValid?: boolean;
  size?: FormSelectSize;
}

export type FormSelectSize = 'lg' | 'sm';
