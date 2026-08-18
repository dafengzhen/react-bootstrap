```typescript
export interface BadgeProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  bg?: BadgeBg;
  children?: ReactNode;
  className?: string;
  href?: string;
  pill?: boolean;
  text?: BadgeText;
}
```
