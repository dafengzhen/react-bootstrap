```typescript
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  defaultActive?: boolean;
  disabled?: boolean;
  download?: string;
  href?: string;
  label?: string;
  loading?: boolean;
  rel?: string;
  shape?: IconButtonShape;
  size?: ButtonSize;
  target?: string;
  toggle?: boolean;
  variant?: ButtonVariant;
}
```
