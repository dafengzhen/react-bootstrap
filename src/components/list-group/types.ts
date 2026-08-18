import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export type ListGroupHorizontal = 'lg' | 'md' | 'sm' | 'xl' | 'xxl';

export interface ListGroupItemProps extends HTMLAttributes<HTMLElement> {
  action?: boolean;
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  type?: 'button' | 'reset' | 'submit';
  variant?: ListGroupItemVariant;
}

export type ListGroupItemVariant =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

export interface ListGroupProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  flush?: boolean;
  horizontal?: boolean | ListGroupHorizontal;
  numbered?: boolean;
}
