```typescript
export interface NavLinkProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  eventKey?: EventKey;
  href?: string;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  type?: 'button' | 'reset' | 'submit';
}
```
