import type { AnchorHTMLAttributes, ElementType, HTMLAttributes, ReactNode } from 'react';

import type { CloseButtonVariant } from '../close-button';

export interface AlertHeadingProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface AlertLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  href?: string;
}

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  closeLabel?: string;
  closeVariant?: CloseButtonVariant;
  dismissible?: boolean;
  onClose?: () => void;
  show?: boolean;
  variant?: AlertVariant;
}

export type AlertVariant =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';
