import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface MarkProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}
