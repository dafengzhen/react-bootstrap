import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export type PaginationAlign = 'center' | 'end';

export interface PaginationItemProps extends HTMLAttributes<HTMLElement> {
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface PaginationLinkProps extends HTMLAttributes<HTMLElement> {
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
}

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  align?: PaginationAlign;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  label?: string;
  listAs?: ElementType;
  listProps?: HTMLAttributes<HTMLElement>;
  size?: PaginationSize;
}

export type PaginationSize = 'lg' | 'sm';
