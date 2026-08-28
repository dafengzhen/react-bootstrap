import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export type RatioAspectRatio = '16x9' | '1x1' | '21x9' | '4x3' | ({} & string);

export interface RatioProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  aspectRatio?: number | RatioAspectRatio;
  children?: ReactNode;
  className?: string;
}
