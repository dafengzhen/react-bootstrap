```typescript
export interface DropdownToggleProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
  size?: ButtonSize;
  split?: boolean;
  toggleLabel?: string;
  type?: 'button' | 'reset' | 'submit';
  variant?: ButtonVariant;
}
```
