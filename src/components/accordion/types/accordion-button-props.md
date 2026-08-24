```typescript
export interface AccordionButtonProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'reset' | 'submit';
}
```
