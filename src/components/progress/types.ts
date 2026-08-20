import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';

export interface ProgressBarProps extends HTMLAttributes<HTMLElement> {
  animated?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  max?: number;
  min?: number;
  now?: number;
  striped?: boolean;
  textBg?: boolean;
  variant?: ProgressVariant;
}

export type ProgressCssProperties = {
  '--bs-progress-height'?: string;
} & CSSProperties;

export interface ProgressProps extends HTMLAttributes<HTMLElement> {
  animated?: boolean;
  as?: ElementType;
  bar?: boolean;
  barAs?: ElementType;
  barProps?: ProgressBarProps;
  children?: ReactNode;
  className?: string;
  height?: number | string;
  label?: string;
  max?: number;
  min?: number;
  now?: number;
  role?: string;
  striped?: boolean;
  textBg?: boolean;
  variant?: ProgressVariant;
}

export interface ProgressStackedContextValue {
  height?: number | string;
}

export interface ProgressStackedProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  height?: number | string;
}

export type ProgressVariant =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';
