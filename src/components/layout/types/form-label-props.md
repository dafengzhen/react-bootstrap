```typescript
export interface FormLabelProps
  extends
    LabelHTMLAttributes<HTMLLabelElement>,
    Pick<ColProps, 'lg' | 'md' | 'sm' | 'xl' | 'xs' | 'xxl'> {
  as?: ElementType;
  className?: string;
  column?: FormLabelColumn;
  htmlFor?: string;
  visuallyHidden?: boolean;
}
```
