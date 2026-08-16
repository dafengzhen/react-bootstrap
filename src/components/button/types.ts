import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  block?: boolean;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export type ButtonSize = 'lg' | 'sm';

export type ButtonVariant =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'link'
  | 'outline-danger'
  | 'outline-dark'
  | 'outline-info'
  | 'outline-light'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-warning'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';
