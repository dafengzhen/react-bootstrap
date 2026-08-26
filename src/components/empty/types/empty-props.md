```typescript
export interface EmptyProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  image?: ReactNode;
  size?: EmptySize;
  title?: ReactNode;
}
```
