import type { ElementType, HTMLAttributes } from 'react';

export type ContainerFluid = 'lg' | 'md' | 'sm' | 'xl' | 'xxl';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  className?: string;
  fluid?: boolean | ContainerFluid;
}
