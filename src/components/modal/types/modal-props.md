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
  duration?: number;
  fullscreen?: ModalFullscreen;
  isOpen?: boolean;
  keyboard?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  scrollable?: boolean;
  size?: ModalSize;
  style?: CSSProperties;
}
```
