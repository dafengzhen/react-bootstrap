import type {
  ButtonHTMLAttributes,
  CSSProperties,
  DialogHTMLAttributes,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from 'react';

export type OffcanvasAnimationStatus = 'closed' | 'closing' | 'opened' | 'opening';

export type OffcanvasBackdrop = 'static' | boolean;

export interface OffcanvasBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface OffcanvasCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

export interface OffcanvasContextValue {
  close: () => void;
  status: OffcanvasAnimationStatus;
  titleId: string;
}

export type OffcanvasCssProperties = {
  '--rbs-offcanvas-duration'?: string;
} & CSSProperties;

export interface OffcanvasHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  closeButton?: boolean;
  closeLabel?: string;
}

export type OffcanvasPlacement = 'bottom' | 'end' | 'start' | 'top';

export interface OffcanvasProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'children'> {
  ariaLabel?: string;
  backdrop?: OffcanvasBackdrop;
  backdropClassName?: string;
  backdropStyle?: CSSProperties;
  children: ReactNode;
  className?: string;
  duration?: number;
  isOpen?: boolean;
  keyboard?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  placement?: OffcanvasPlacement;
  scroll?: boolean;
  style?: CSSProperties;
}

export interface OffcanvasTitleProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}
