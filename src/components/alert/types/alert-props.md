```typescript
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  closeLabel?: string;
  closeVariant?: CloseButtonVariant;
  dismissible?: boolean;
  onClose?: () => void;
  show?: boolean;
  variant?: AlertVariant;
}
```
