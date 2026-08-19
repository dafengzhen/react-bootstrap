import type { ElementType, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';

export type EventKey = null | number | string;

export type NavBreakpoint = 'lg' | 'md' | 'sm' | 'xl' | 'xxl';

export interface NavContextValue {
  activeEventKey?: EventKey;
  onSelect: (eventKey: EventKey, event: SyntheticEvent) => void;
  role?: string;
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

export interface TabContainerProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  activeKey?: EventKey;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  defaultActiveKey?: EventKey;
  id?: string;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  transition?: boolean;
}

export interface TabContentProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface TabPaneProps extends HTMLAttributes<HTMLElement> {
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  eventKey?: EventKey;
  transition?: boolean;
}

export interface TabProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect' | 'title'> {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  eventKey?: EventKey;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  tabClassName?: string;
  title: ReactNode;
}

export interface TabsContextValue {
  activeEventKey?: EventKey;
  id?: string;
  onSelect: (eventKey: EventKey, event: SyntheticEvent) => void;
  transition: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  activeKey?: EventKey;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  defaultActiveKey?: EventKey;
  fill?: boolean;
  id?: string;
  justify?: boolean;
  navClassName?: string;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  transition?: boolean;
  variant?: NavVariant;
}
