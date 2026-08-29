import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}
