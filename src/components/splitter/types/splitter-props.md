```typescript
export interface SplitterProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  as?: ElementType;
  barSize?: number;
  children?: ReactNode;
  className?: string;
  defaultSizes?: SplitterSize[];
  disabled?: boolean;
  layout?: SplitterLayout;
  onChange?: (sizes: SplitterSize[]) => void;
  onResizeEnd?: (sizes: SplitterSize[]) => void;
  onResizeStart?: (sizes: SplitterSize[]) => void;
  renderBar?: (props: SplitterBarRenderProps, index: number) => ReactNode;
  sizes?: SplitterSize[];
}
```
