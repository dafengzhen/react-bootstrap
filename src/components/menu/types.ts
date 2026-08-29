import type { ElementType, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';

export type EventKey = null | number | string;

export interface MenuContextValue {
  activeKeys: EventKey[];
  inlineCollapsed: boolean;
  inlineIndent: number;
  level: number;
  mode: MenuMode;
  multiple: boolean;
  onItemSelect: (eventKey: EventKey, event: SyntheticEvent) => void;
  onOpenChange: (openKeys: EventKey[]) => void;
  openKeys: EventKey[];
  popup: boolean;
  selectable: boolean;
  theme: MenuTheme;
  trigger: MenuTrigger;
}

export interface MenuDividerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface MenuGroupProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  label: ReactNode;
}

export interface MenuItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect' | 'title'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  danger?: boolean;
  disabled?: boolean;
  eventKey?: EventKey;
  icon?: ReactNode;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  title?: string;
}

export type MenuMode = 'horizontal' | 'inline' | 'vertical';

export interface MenuProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  activeKey?: EventKey | EventKey[];
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  collapsedWidth?: number;
  defaultActiveKey?: EventKey | EventKey[];
  defaultOpenKeys?: EventKey[];
  inlineCollapsed?: boolean;
  inlineIndent?: number;
  mode?: MenuMode;
  multiple?: boolean;
  onOpenChange?: (openKeys: EventKey[]) => void;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  openKeys?: EventKey[];
  selectable?: boolean;
  theme?: MenuTheme;
  trigger?: MenuTrigger;
}

export interface MenuSubMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect' | 'title'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  eventKey?: EventKey;
  icon?: ReactNode;
  title: ReactNode;
}

export type MenuTheme = 'dark' | 'light';

export type MenuTrigger = 'click' | 'hover';
