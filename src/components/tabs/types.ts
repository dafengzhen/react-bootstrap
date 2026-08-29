import type { ElementType, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';

import type { EventKey, NavVariant } from '../nav';

export type {
  EventKey,
  NavBreakpoint,
  NavContextValue,
  NavItemProps,
  NavLinkProps,
  NavProps,
  NavVariant,
  TabsContextValue,
} from '../nav';

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
