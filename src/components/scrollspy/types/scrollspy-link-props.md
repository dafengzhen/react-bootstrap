```typescript
export interface ScrollSpyLinkProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  smoothScroll?: boolean;
  targetId?: string;
}
```
