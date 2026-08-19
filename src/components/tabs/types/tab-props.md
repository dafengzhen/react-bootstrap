```typescript
export interface TabProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect' | 'title'> {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  eventKey?: EventKey;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  tabClassName?: string;
  title: ReactNode;
}
```
