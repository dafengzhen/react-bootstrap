```typescript
export interface DropdownProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect' | 'onToggle'> {
  align?: DropdownAlignOption;
  as?: ElementType;
  autoClose?: DropdownAutoClose;
  children?: ReactNode;
  className?: string;
  defaultShow?: boolean;
  drop?: DropdownDirection;
  flip?: boolean;
  focusFirstItemOnShow?: 'keyboard' | boolean;
  onSelect?: SelectCallback;
  onToggle?: ToggleCallback;
  popperConfig?: DropdownPositionConfig;
  renderMenuOnMount?: boolean;
  show?: boolean;
}
```
