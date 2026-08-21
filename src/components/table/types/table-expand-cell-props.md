```typescript
export interface TableExpandCellProps extends Omit<HTMLAttributes<HTMLElement>, 'onToggle'> {
  active?: boolean;
  align?: TableAlign;
  as?: ElementType;
  className?: string;
  collapseLabel?: string;
  disabled?: boolean;
  expandLabel?: string;
  expanded?: boolean;
  onToggle?: (expanded: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  variant?: TableVariant;
}
```
