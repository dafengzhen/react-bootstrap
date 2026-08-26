```typescript
export interface InputOtpSlotProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  className?: string;
  index: number;
}
```
