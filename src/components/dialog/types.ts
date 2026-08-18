import type {
  ButtonHTMLAttributes,
  CSSProperties,
  DialogHTMLAttributes,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from 'react';

export type DialogAction =
  | { type: 'ANIMATION_END' }
  | { type: 'ANIMATION_START' }
  | { type: 'CLOSE' }
  | { type: 'INSTANT_OPEN' }
  | { type: 'OPEN' };

export type DialogAnimationStatus = 'closed' | 'closing' | 'opened' | 'opening';

export interface DialogBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface DialogCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

export interface DialogContextValue {
  close: () => void;
  descriptionId: string;
  titleId: string;
}

export type DialogCssProperties = {
  '--dialog-duration'?: string;
  '--dialog-height'?: string;
  '--dialog-max-width'?: string;
  '--dialog-width'?: string;
} & CSSProperties;

export interface DialogDescriptionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export type DialogPlacement = 'bottom' | 'center' | 'left' | 'right' | 'top';

export interface DialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'children'> {
  ariaLabel?: string;
  backdropClassName?: string;
  backdropStyle?: CSSProperties;
  children: ReactNode;
  className?: string;
  closeOnBackdropClick?: boolean;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  duration?: number;
  height?: number | string;
  isOpen?: boolean;
  maxWidth?: number | string;
  onOpenChange?: (isOpen: boolean) => void;
  placement?: DialogPlacement;
  showBackdrop?: boolean;
  width?: number | string;
}

export interface DialogState {
  mounted: boolean;
  status: DialogAnimationStatus;
}

export interface DialogTitleProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}
