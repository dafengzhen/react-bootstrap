```typescript
export interface TabContainerProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  activeKey?: EventKey;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  defaultActiveKey?: EventKey;
  id?: string;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  transition?: boolean;
}
```
