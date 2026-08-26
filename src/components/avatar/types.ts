import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export type AvatarBg =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

export interface AvatarGroupContextValue {
  bg?: AvatarBg;
  border: boolean;
  shape?: AvatarShape;
  size?: AvatarSize | number;
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  bg?: AvatarBg;
  border?: boolean;
  children?: ReactNode;
  className?: string;
  max?: number;
  overlap?: number | string;
  shape?: AvatarShape;
  size?: AvatarSize | number;
}

export interface AvatarProps extends HTMLAttributes<HTMLElement> {
  alt?: string;
  as?: ElementType;
  bg?: AvatarBg;
  border?: boolean;
  children?: ReactNode;
  className?: string;
  name?: string;
  shape?: AvatarShape;
  size?: AvatarSize | number;
  src?: string;
}

export type AvatarShape = 'circle' | 'rounded' | 'square';

export type AvatarSize = 'lg' | 'md' | 'sm' | 'xl' | 'xs';
