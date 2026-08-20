```typescript
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
```
