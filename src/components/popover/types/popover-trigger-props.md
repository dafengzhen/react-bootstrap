```typescript
export interface PopoverTriggerProps {
  animation?: boolean;
  children: ReactElement;
  content?: ReactNode;
  customClass?: string;
  defaultShow?: boolean;
  delay?: number | PopoverDelay;
  disabled?: boolean;
  flip?: boolean;
  id?: string;
  offset?: readonly [number, number];
  onToggle?: (nextShow: boolean) => void;
  overlay?: ReactElement;
  padding?: number;
  placement?: Placement;
  show?: boolean;
  title?: ReactNode;
  trigger?: PopoverTriggerType | PopoverTriggerType[];
}
```
