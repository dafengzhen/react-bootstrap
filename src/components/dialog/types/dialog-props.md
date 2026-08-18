```typescript
export interface DialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'children'> {
  ariaLabel?: string;
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
  backdropClassName?: string;
  backdropStyle?: CSSProperties;
  placement?: DialogPlacement;
  showBackdrop?: boolean;
  width?: number | string;
}
```
