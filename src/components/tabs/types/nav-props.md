```typescript
export interface NavProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  activeKey?: EventKey;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  defaultActiveKey?: EventKey;
  fill?: boolean;
  justify?: boolean;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  variant?: NavVariant;
  vertical?: boolean | NavBreakpoint;
}
```
