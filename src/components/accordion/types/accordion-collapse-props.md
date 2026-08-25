```typescript
export interface AccordionCollapseProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  dimension?: AccordionCollapseDimension;
  duration?: number;
  eventKey?: AccordionEventKey;
  onEnter?: () => void;
  onEntered?: () => void;
  onEntering?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  onExiting?: () => void;
}
```
