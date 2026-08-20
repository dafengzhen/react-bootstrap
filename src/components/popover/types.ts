import type { ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';

import type { Placement } from '../../utils';

export interface PopoverDelay {
  hide?: number;
  show?: number;
}

export interface PopoverProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  animation?: boolean;
  arrowProps?: HTMLAttributes<HTMLElement>;
  as?: ElementType;
  bodyProps?: HTMLAttributes<HTMLElement>;
  children?: ReactNode;
  className?: string;
  flip?: boolean;
  headerProps?: HTMLAttributes<HTMLElement>;
  id?: string;
  placement?: Placement;
  show?: boolean;
  title?: ReactNode;
}

export interface PopoverTriggerProps {
  animation?: boolean;
  children: ReactElement;
  content?: ReactNode;
  customClass?: string;
  defaultShow?: boolean;
  delay?: number | PopoverDelay;
  disabled?: boolean;
  flip?: boolean;
  id?: string;
  offset?: readonly [number, number];
  onToggle?: (nextShow: boolean) => void;
  overlay?: ReactElement;
  padding?: number;
  placement?: Placement;
  show?: boolean;
  title?: ReactNode;
  trigger?: PopoverTriggerType | PopoverTriggerType[];
}

export type PopoverTriggerType = 'click' | 'focus' | 'hover' | 'manual';
