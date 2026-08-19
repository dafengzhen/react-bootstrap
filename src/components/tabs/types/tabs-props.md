```typescript
export interface TabsProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  activeKey?: EventKey;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  defaultActiveKey?: EventKey;
  fill?: boolean;
  id?: string;
  justify?: boolean;
  navClassName?: string;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  transition?: boolean;
  variant?: NavVariant;
}
```
