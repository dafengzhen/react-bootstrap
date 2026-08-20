import type {
  AriaRole,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from 'react';

export type ToastAnimationStatus = 'closed' | 'closing' | 'opened' | 'opening';

export interface ToastBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface ToastCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

export interface ToastContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  placement?: ToastPlacement;
  position?: ToastPosition;
}

export interface ToastContextValue {
  close: () => void;
  status: ToastAnimationStatus;
  variant?: ToastVariant;
}

export type ToastCssProperties = {
  '--rbs-toast-duration'?: string;
} & CSSProperties;

export interface ToastHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  closeButton?: boolean;
  closeLabel?: string;
}

export type ToastPlacement =
  | 'bottom-center'
  | 'bottom-end'
  | 'bottom-start'
  | 'middle-center'
  | 'middle-end'
  | 'middle-start'
  | 'top-center'
  | 'top-end'
  | 'top-start';

export type ToastPosition = 'absolute' | 'fixed' | 'static';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  autohide?: boolean;
  children?: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  onClose?: () => void;
  role?: AriaRole;
  show?: boolean;
  variant?: ToastVariant;
}

export type ToastVariant =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';
