```typescript
export interface TableSelectCellProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  active?: boolean;
  align?: TableAlign;
  as?: ElementType;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  label?: string;
  name?: string;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  variant?: TableVariant;
}
```
