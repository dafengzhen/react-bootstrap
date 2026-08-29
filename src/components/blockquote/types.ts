import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface BlockquoteFooterProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  source?: ReactNode;
  sourceTitle?: string;
}

export interface BlockquoteProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}
