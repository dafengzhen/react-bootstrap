```typescript
export interface StepsItemProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  index?: number;
  status?: StepsStatus;
  title?: ReactNode;
}
```
