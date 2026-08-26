```typescript
export interface TimelineProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  align?: TimelineAlign;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  color?: TimelineColor;
}
```
