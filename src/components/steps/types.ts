import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface StepsContextValue {
  active: number;
  clickable: boolean;
  direction: StepsDirection;
  handleSelect: (index: number) => void;
  variant: StepsVariant;
}

export type StepsDirection = 'horizontal' | 'vertical';

export interface StepsItemProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  index?: number;
  status?: StepsStatus;
  title?: ReactNode;
}

export interface StepsProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  active?: number;
  as?: ElementType;
  center?: boolean;
  children?: ReactNode;
  className?: string;
  clickable?: boolean;
  defaultActive?: number;
  direction?: StepsDirection;
  onChange?: (active: number) => void;
  variant?: StepsVariant;
}

export type StepsStatus = 'error' | 'finish' | 'process' | 'wait';

export type StepsVariant = 'default' | 'dots';
