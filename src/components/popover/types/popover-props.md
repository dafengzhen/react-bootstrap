```typescript
export interface PopoverProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  animation?: boolean;
  arrowProps?: HTMLAttributes<HTMLElement>;
  as?: ElementType;
  bodyProps?: HTMLAttributes<HTMLElement>;
  children?: ReactNode;
  className?: string;
  flip?: boolean;
  headerProps?: HTMLAttributes<HTMLElement>;
  id?: string;
  placement?: Placement;
  show?: boolean;
  title?: ReactNode;
}
```
