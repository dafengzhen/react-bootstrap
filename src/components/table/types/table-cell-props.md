```typescript
export interface TableCellProps extends HTMLAttributes<HTMLElement> {
  active?: boolean;
  align?: TableAlign;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  scope?: TableCellScope;
  variant?: TableVariant;
}
```
