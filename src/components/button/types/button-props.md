```typescript
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  as?: ElementType;
  block?: boolean;
  children?: ReactNode;
  className?: string;
  defaultActive?: boolean;
  disabled?: boolean;
  download?: string;
  href?: string;
  loading?: boolean;
  loadingText?: string;
  rel?: string;
  size?: ButtonSize;
  target?: string;
  toggle?: boolean;
  variant?: ButtonVariant;
}
```
