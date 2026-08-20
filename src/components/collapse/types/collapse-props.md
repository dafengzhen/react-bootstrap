```typescript
export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  dimension?: CollapseDimension;
  duration?: number;
  in: boolean;
  onEnter?: () => void;
  onEntered?: () => void;
  onEntering?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  onExiting?: () => void;
}
```
