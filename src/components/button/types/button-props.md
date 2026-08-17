```typescript
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  children?: ReactNode;
  className?: string;
}
```
