import type { ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';

import type { Placement } from '../../utils';

export interface TooltipDelay {
  hide?: number;
  show?: number;
}

export interface TooltipProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  animation?: boolean;
  arrowProps?: HTMLAttributes<HTMLElement>;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  flip?: boolean;
  id?: string;
  placement?: Placement;
  show?: boolean;
}

export interface TooltipTriggerProps {
  animation?: boolean;
  children: ReactElement;
  customClass?: string;
  defaultShow?: boolean;
  delay?: number | TooltipDelay;
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
  trigger?: TooltipTriggerType | TooltipTriggerType[];
}

export type TooltipTriggerType = 'click' | 'focus' | 'hover' | 'manual';
