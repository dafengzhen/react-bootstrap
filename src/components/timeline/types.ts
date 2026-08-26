import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export type TimelineAlign = 'alternate' | 'left' | 'right';

export type TimelineColor =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

export interface TimelineContextValue {
  align: TimelineAlign;
  color: TimelineColor;
}

export interface TimelineItemProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  color?: TimelineColor;
  description?: ReactNode;
  dot?: ReactNode;
  index?: number;
  time?: ReactNode;
  title?: ReactNode;
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  align?: TimelineAlign;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  color?: TimelineColor;
}
