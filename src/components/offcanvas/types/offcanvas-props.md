```typescript
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
```
