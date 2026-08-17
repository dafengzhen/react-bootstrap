```typescript
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  bg?: CardColor;
  body?: boolean;
  border?: CardColor;
  children?: ReactNode;
  className?: string;
  text?: CardTextColor;
}
```
