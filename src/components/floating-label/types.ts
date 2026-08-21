import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface FloatingLabelProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  controlId?: string;
  label: ReactNode;
}
