```typescript
export interface NavbarProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect' | 'onToggle'> {
  'data-bs-theme'?: string;
  as?: ElementType;
  bg?: string;
  children?: ReactNode;
  className?: string;
  collapseOnSelect?: boolean;
  expand?: boolean | NavbarExpand;
  expanded?: boolean;
  fixed?: NavbarFixed;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  onToggle?: (expanded: boolean) => void;
  role?: string;
  sticky?: NavbarFixed;
  variant?: NavbarVariant;
}
```
