import type { CSSProperties, ElementType, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';

import type { EventKey } from '../tabs';

export interface NavbarBrandProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  href?: string;
}

export interface NavbarCollapseProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface NavbarContextValue {
  expand?: boolean | NavbarExpand;
  expanded: boolean;
  onSelect: (eventKey: EventKey, event: SyntheticEvent) => void;
  onToggle: () => void;
}

export type NavbarExpand = 'lg' | 'md' | 'sm' | 'xl' | 'xxl';

export type NavbarFixed = 'bottom' | 'top';

export type NavbarOffcanvasCssProperties = {
  '--bs-offcanvas-transition'?: string;
} & CSSProperties;

export type NavbarOffcanvasPlacement = 'bottom' | 'end' | 'start' | 'top';

export interface NavbarOffcanvasProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onHide'> {
  backdrop?: 'static' | boolean;
  children?: ReactNode;
  className?: string;
  duration?: number;
  keyboard?: boolean;
  onEnter?: () => void;
  onEntered?: () => void;
  onEntering?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  onExiting?: () => void;
  onHide?: () => void;
  placement?: NavbarOffcanvasPlacement;
  scroll?: boolean;
}

export interface NavbarProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect' | 'onToggle'> {
  as?: ElementType;
  bg?: string;
  children?: ReactNode;
  className?: string;
  collapseOnSelect?: boolean;
  'data-bs-theme'?: string;
  expand?: boolean | NavbarExpand;
  expanded?: boolean;
  fixed?: NavbarFixed;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  onToggle?: (expanded: boolean) => void;
  role?: string;
  sticky?: NavbarFixed;
  variant?: NavbarVariant;
}

export interface NavbarTextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface NavbarToggleProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  label?: string;
}

export type NavbarVariant = 'dark' | 'light';
