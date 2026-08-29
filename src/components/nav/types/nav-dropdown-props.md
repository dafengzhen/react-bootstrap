```typescript
export interface NavDropdownProps extends Omit<
  DropdownProps,
  'as' | 'children' | 'onSelect' | 'title'
> {
  children?: ReactNode;
  disabled?: boolean;
  eventKey?: EventKey;
  id?: string;
  menuVariant?: DropdownMenuVariant;
  onSelect?: SelectCallback;
  title: ReactNode;
}
```
