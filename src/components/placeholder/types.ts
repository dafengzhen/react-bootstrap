import type { ButtonHTMLAttributes, ElementType, HTMLAttributes, ReactNode } from 'react';

import type { ButtonVariant } from '../button';

export type PlaceholderAnimation = 'glow' | 'wave';

export type PlaceholderBg =
  | 'body-secondary'
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

export interface PlaceholderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  animation?: PlaceholderAnimation;
  bg?: PlaceholderBg;
  children?: ReactNode;
  className?: string;
  size?: PlaceholderSize;
  variant?: ButtonVariant;
  xs?: 'auto' | boolean | number;
}

export interface PlaceholderProps extends HTMLAttributes<HTMLElement> {
  animation?: PlaceholderAnimation;
  as?: ElementType;
  bg?: PlaceholderBg;
  children?: ReactNode;
  className?: string;
  size?: PlaceholderSize;
  xs?: 'auto' | boolean | number;
}

export type PlaceholderSize = 'lg' | 'sm' | 'xs';
