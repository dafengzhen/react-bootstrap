import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export type SpinnerAnimation = 'border' | 'grow';

export interface SpinnerProps extends HTMLAttributes<HTMLElement> {
  animation?: SpinnerAnimation;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  role?: string;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
}

export type SpinnerSize = 'sm';

export type SpinnerVariant =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';
