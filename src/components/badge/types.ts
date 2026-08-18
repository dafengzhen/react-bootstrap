import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export type BadgeBg =
  | 'body-secondary'
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

export interface BadgeProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  bg?: BadgeBg;
  children?: ReactNode;
  className?: string;
  href?: string;
  pill?: boolean;
  text?: BadgeText;
}

export type BadgeText = 'dark' | 'light';
