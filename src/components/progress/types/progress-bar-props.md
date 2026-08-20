```typescript
export interface ProgressBarProps extends HTMLAttributes<HTMLElement> {
  animated?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  max?: number;
  min?: number;
  now?: number;
  striped?: boolean;
  textBg?: boolean;
  variant?: ProgressVariant;
}
```
