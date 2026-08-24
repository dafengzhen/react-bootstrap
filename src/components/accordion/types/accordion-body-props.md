```typescript
export interface AccordionBodyProps extends Omit<CollapseProps, 'children' | 'in'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}
```
