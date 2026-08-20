import type { ElementType, HTMLAttributes, MouseEvent, ReactNode } from 'react';

export interface ScrollSpyContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  tabIndex?: number;
}

export interface ScrollSpyContextValue {
  activeId: null | string;
  registerContainer: (element: HTMLElement | null) => void;
  registerLink: (targetId: string) => () => void;
  requestScroll: (targetId: string, smooth: boolean) => void;
  smoothScroll: boolean;
}

export interface ScrollSpyLinkProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  smoothScroll?: boolean;
  targetId?: string;
}

export interface ScrollSpyProps {
  activeId?: string;
  children?: ReactNode;
  defaultActiveId?: string;
  onActivate?: (activeId: null | string, link: HTMLElement | null) => void;
  rootMargin?: string;
  smoothScroll?: boolean;
  target?: string;
  threshold?: number | number[];
}
