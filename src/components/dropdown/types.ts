import type { ElementType, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';

import type { ButtonSize, ButtonVariant } from '../button';

export type DropdownAlign = 'end' | 'start';

export interface DropdownAlignMap {
  lg?: DropdownAlign;
  md?: DropdownAlign;
  sm?: DropdownAlign;
  xl?: DropdownAlign;
  xs?: DropdownAlign;
  xxl?: DropdownAlign;
}

export type DropdownAlignOption = DropdownAlign | DropdownAlignMap;

export type DropdownAutoClose = 'inside' | 'outside' | boolean;

export interface DropdownButtonProps extends Omit<DropdownProps, 'as' | 'children' | 'title'> {
  children?: ReactNode;
  disabled?: boolean;
  id?: string;
  menuVariant?: DropdownMenuVariant;
  size?: ButtonSize;
  title: ReactNode;
  toggleClassName?: string;
  type?: 'button' | 'reset' | 'submit';
  variant?: ButtonVariant;
}

export interface DropdownContextValue {
  align?: DropdownAlignOption;
  autoClose: DropdownAutoClose;
  drop: DropdownDirection;
  flip: boolean;
  focusFirstItemOnShow: 'keyboard' | boolean;
  menuElement: HTMLElement | null;
  onSelect: SelectCallback;
  popperConfig?: DropdownPositionConfig;
  renderMenuOnMount: boolean;
  setMenu: (element: HTMLElement | null) => void;
  setToggle: (element: HTMLElement | null, id?: string) => void;
  show: boolean;
  source?: DropdownToggleSource;
  toggle: ToggleCallback;
  toggleElement: HTMLElement | null;
  toggleId?: string;
}

export type DropdownDirection = 'down-centered' | 'down' | 'end' | 'start' | 'up-centered' | 'up';

export interface DropdownDividerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface DropdownHeaderProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface DropdownItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  eventKey?: EventKey;
  href?: string;
  onSelect?: SelectCallback;
}

export interface DropdownItemTextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface DropdownMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  align?: DropdownAlignOption;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  flip?: boolean;
  popperConfig?: DropdownPositionConfig;
  renderOnMount?: boolean;
  show?: boolean;
  variant?: DropdownMenuVariant;
}

export type DropdownMenuVariant = 'dark';

export interface DropdownPositionConfig {
  flip?: boolean;
  offset?: readonly [number, number];
  padding?: number;
}

export interface DropdownProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect' | 'onToggle'> {
  align?: DropdownAlignOption;
  as?: ElementType;
  autoClose?: DropdownAutoClose;
  children?: ReactNode;
  className?: string;
  defaultShow?: boolean;
  drop?: DropdownDirection;
  flip?: boolean;
  focusFirstItemOnShow?: 'keyboard' | boolean;
  onSelect?: SelectCallback;
  onToggle?: ToggleCallback;
  popperConfig?: DropdownPositionConfig;
  renderMenuOnMount?: boolean;
  show?: boolean;
}

export interface DropdownToggleProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
  size?: ButtonSize;
  split?: boolean;
  toggleLabel?: string;
  type?: 'button' | 'reset' | 'submit';
  variant?: ButtonVariant;
}

export type DropdownToggleSource = 'click' | 'keydown' | 'rootClose' | 'select';

export type EventKey = number | string;

export type SelectCallback = (eventKey: EventKey | null, event: SyntheticEvent) => void;

export interface SplitButtonProps extends DropdownButtonProps {
  href?: string;
  toggleLabel?: string;
}

export type ToggleCallback = (
  nextShow: boolean,
  event?: Event | SyntheticEvent,
  source?: DropdownToggleSource,
) => void;
