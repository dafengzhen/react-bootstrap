```typescript
export interface CarouselControlProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  direction: CarouselDirection;
  label?: string;
}
```
