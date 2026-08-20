```typescript
export interface TooltipTriggerProps {
  animation?: boolean;
  children: ReactElement;
  customClass?: string;
  defaultShow?: boolean;
  delay?: number | TooltipDelay;
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
  trigger?: TooltipTriggerType | TooltipTriggerType[];
}
```
