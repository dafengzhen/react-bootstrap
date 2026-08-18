import type { ElementType, HTMLAttributes, OlHTMLAttributes, ReactNode } from 'react';

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLElement> {
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  divider?: string;
  label?: string;
  listAs?: ElementType;
  listProps?: OlHTMLAttributes<HTMLOListElement>;
}
