```typescript
export interface PlaceholderProps extends HTMLAttributes<HTMLElement> {
  animation?: PlaceholderAnimation;
  as?: ElementType;
  bg?: PlaceholderBg;
  children?: ReactNode;
  className?: string;
  size?: PlaceholderSize;
  xs?: 'auto' | boolean | number;
}
```
