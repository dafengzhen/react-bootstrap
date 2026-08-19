```typescript
export interface PlaceholderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  animation?: PlaceholderAnimation;
  bg?: PlaceholderBg;
  children?: ReactNode;
  className?: string;
  size?: PlaceholderSize;
  variant?: ButtonVariant;
  xs?: 'auto' | boolean | number;
}
```
