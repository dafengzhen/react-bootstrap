```typescript
export interface ScrollShadowProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  direction?: ScrollShadowDirection;
  disabled?: boolean;
  onChange?: (visibility: ScrollShadowVisibility) => void;
  onScroll?: UIEventHandler<HTMLElement>;
  shadowColor?: string;
  shadowSize?: number;
  tabIndex?: number;
}
```
