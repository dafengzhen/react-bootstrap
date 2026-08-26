import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export type EmptyBg =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

export interface EmptyImageProps extends HTMLAttributes<HTMLElement> {
  alt?: string;
  as?: ElementType;
  bg?: EmptyBg;
  children?: ReactNode;
  className?: string;
  height?: number | string;
  label?: string;
  shape?: EmptyImageShape;
  src?: string;
  width?: number | string;
}

export type EmptyImageShape = 'circle' | 'rounded' | 'square';

export interface EmptyProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  image?: ReactNode;
  size?: EmptySize;
  title?: ReactNode;
}

export type EmptySize = 'lg' | 'md' | 'sm';
