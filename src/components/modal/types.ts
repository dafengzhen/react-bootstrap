import type {
  ButtonHTMLAttributes,
  CSSProperties,
  DialogHTMLAttributes,
  ElementType,
  HTMLAttributes,
  ReactNode,
  RefObject,
  TransitionEvent,
} from 'react';

export type ModalAction =
  | { type: 'ANIMATION_END' }
  | { type: 'ANIMATION_START' }
  | { type: 'CLOSE' }
  | { type: 'INSTANT_OPEN' }
  | { type: 'OPEN' };

export type ModalAnimationStatus = 'closed' | 'closing' | 'opened' | 'opening';

export type ModalBackdrop = 'static' | boolean;

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface ModalCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

export interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface ModalContextValue {
  close: () => void;
  contentRef: RefObject<HTMLDivElement | null>;
  handleContentTransitionEnd: (event: TransitionEvent<HTMLDivElement>) => void;
  status: ModalAnimationStatus;
  titleId: string;
}

export type ModalCssProperties = {
  '--modal-duration'?: string;
} & CSSProperties;

export interface ModalDialogProps extends HTMLAttributes<HTMLDivElement> {
  centered?: boolean;
  children?: ReactNode;
  className?: string;
  fullscreen?: ModalFullscreen;
  scrollable?: boolean;
  size?: ModalSize;
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export type ModalFullscreen = 'lg-down' | 'md-down' | 'sm-down' | 'xl-down' | 'xxl-down' | boolean;

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  closeButton?: boolean;
  closeLabel?: string;
}

export interface ModalProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'children'> {
  ariaLabel?: string;
  backdrop?: ModalBackdrop;
  backdropClassName?: string;
  backdropStyle?: CSSProperties;
  centered?: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  dialogClassName?: string;
  dialogStyle?: CSSProperties;
  duration?: number;
  fullscreen?: ModalFullscreen;
  isOpen?: boolean;
  keyboard?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  scrollable?: boolean;
  size?: ModalSize;
  style?: CSSProperties;
}

export type ModalSize = 'lg' | 'sm' | 'xl';

export interface ModalState {
  mounted: boolean;
  status: ModalAnimationStatus;
}

export interface ModalTitleProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}
