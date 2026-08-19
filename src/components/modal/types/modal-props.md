```typescript
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
  direction?: ModalDirection;
  duration?: number;
  fullscreen?: ModalFullscreen;
  height?: number | string;
  isOpen?: boolean;
  keyboard?: boolean;
  maxWidth?: number | string;
  onOpenChange?: (isOpen: boolean) => void;
  placement?: ModalPlacement;
  scrollable?: boolean;
  size?: ModalSize;
  style?: CSSProperties;
  width?: number | string;
}
```
