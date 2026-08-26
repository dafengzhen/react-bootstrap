```typescript
export interface TimelineItemProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  color?: TimelineColor;
  description?: ReactNode;
  dot?: ReactNode;
  index?: number;
  time?: ReactNode;
  title?: ReactNode;
}
```
