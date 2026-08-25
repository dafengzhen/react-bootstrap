```typescript
export interface SplitterPanelProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  collapsedSize?: number | string;
  defaultCollapsed?: boolean;
  defaultSize?: number | string;
  index?: number;
  max?: number | string;
  min?: number | string;
  onCollapse?: (collapsed: boolean) => void;
  resizable?: boolean;
}
```
