import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  as?: ElementType;
  block?: boolean;
  children?: ReactNode;
  className?: string;
  defaultActive?: boolean;
  disabled?: boolean;
  download?: string;
  href?: string;
  loading?: boolean;
  loadingText?: string;
  rel?: string;
  size?: ButtonSize;
  target?: string;
  toggle?: boolean;
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
