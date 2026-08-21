```typescript
export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  align?: TableAlign;
  as?: ElementType;
  bordered?: boolean;
  borderless?: boolean;
  children?: ReactNode;
  className?: string;
  hover?: boolean;
  responsive?: boolean | TableBreakpoint;
  size?: TableSize;
  striped?: TableStriped;
  variant?: TableVariant;
}
```
