```typescript
export interface StepsProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  active?: number;
  as?: ElementType;
  center?: boolean;
  children?: ReactNode;
  className?: string;
  clickable?: boolean;
  defaultActive?: number;
  direction?: StepsDirection;
  onChange?: (active: number) => void;
  variant?: StepsVariant;
}
```
