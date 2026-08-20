```typescript
export interface DropdownButtonProps extends Omit<DropdownProps, 'as' | 'children' | 'title'> {
  children?: ReactNode;
  disabled?: boolean;
  id?: string;
  menuVariant?: DropdownMenuVariant;
  size?: ButtonSize;
  title: ReactNode;
  toggleClassName?: string;
  type?: 'button' | 'reset' | 'submit';
  variant?: ButtonVariant;
}
```
