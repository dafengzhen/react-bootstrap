```typescript
export interface AccordionProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  activeKey?: AccordionEventKey | AccordionEventKey[];
  alwaysOpen?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  defaultActiveKey?: AccordionEventKey | AccordionEventKey[];
  flush?: boolean;
  id?: string;
  onSelect?: AccordionSelectCallback;
}
```
