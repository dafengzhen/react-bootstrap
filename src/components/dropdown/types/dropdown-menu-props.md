```typescript
export interface DropdownMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  align?: DropdownAlignOption;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  flip?: boolean;
  popperConfig?: DropdownPositionConfig;
  renderOnMount?: boolean;
  show?: boolean;
  variant?: DropdownMenuVariant;
}
```
