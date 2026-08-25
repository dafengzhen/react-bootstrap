```typescript
export interface AccordionBodyProps extends Omit<AccordionCollapseProps, 'children' | 'eventKey'> {
  as?: ElementType;
  children?: ReactNode;
}
```
