import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface AbbrProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  initialism?: boolean;
}
