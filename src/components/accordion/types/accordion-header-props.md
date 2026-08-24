```typescript
export interface AccordionHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}
```
