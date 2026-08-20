```typescript
export interface DropdownItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  eventKey?: EventKey;
  href?: string;
  onSelect?: SelectCallback;
}
```
