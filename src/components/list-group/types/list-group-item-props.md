```typescript
export interface ListGroupItemProps extends HTMLAttributes<HTMLElement> {
  action?: boolean;
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  type?: 'button' | 'reset' | 'submit';
  variant?: ListGroupItemVariant;
}
```
