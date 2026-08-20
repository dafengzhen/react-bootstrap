```typescript
export interface TooltipProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  animation?: boolean;
  arrowProps?: HTMLAttributes<HTMLElement>;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  flip?: boolean;
  id?: string;
  placement?: Placement;
  show?: boolean;
}
```
