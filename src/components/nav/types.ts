import type { ElementType, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';

import type { DropdownMenuVariant, DropdownProps, SelectCallback } from '../dropdown';

export type EventKey = null | number | string;

export type NavBreakpoint = 'lg' | 'md' | 'sm' | 'xl' | 'xxl';

export interface NavContextValue {
  activeEventKey?: EventKey;
  onSelect: (eventKey: EventKey, event: SyntheticEvent) => void;
  role?: string;
}

export interface NavDropdownProps extends Omit<
  DropdownProps,
  'as' | 'children' | 'onSelect' | 'title'
> {
  children?: ReactNode;
  disabled?: boolean;
  eventKey?: EventKey;
  id?: string;
  menuVariant?: DropdownMenuVariant;
  onSelect?: SelectCallback;
  title: ReactNode;
}

export interface NavItemProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface NavLinkProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  eventKey?: EventKey;
  href?: string;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  type?: 'button' | 'reset' | 'submit';
}

export interface NavProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  activeKey?: EventKey;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  defaultActiveKey?: EventKey;
  fill?: boolean;
  justify?: boolean;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  variant?: NavVariant;
  vertical?: boolean | NavBreakpoint;
}

export type NavVariant = 'pills' | 'tabs' | 'underline';

export interface TabsContextValue {
  activeEventKey?: EventKey;
  id?: string;
  onSelect: (eventKey: EventKey, event: SyntheticEvent) => void;
  transition: boolean;
}
