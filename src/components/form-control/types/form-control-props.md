```typescript
export interface FormControlProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  as?: ElementType;
  htmlSize?: number;
  isInvalid?: boolean;
  isValid?: boolean;
  plaintext?: boolean;
  size?: FormControlSize;
  type?: string;
}
```
