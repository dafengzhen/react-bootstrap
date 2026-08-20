```typescript
export interface ProgressProps extends HTMLAttributes<HTMLElement> {
  animated?: boolean;
  as?: ElementType;
  bar?: boolean;
  barAs?: ElementType;
  barProps?: ProgressBarProps;
  children?: ReactNode;
  className?: string;
  height?: number | string;
  label?: string;
  max?: number;
  min?: number;
  now?: number;
  role?: string;
  striped?: boolean;
  textBg?: boolean;
  variant?: ProgressVariant;
}
```
