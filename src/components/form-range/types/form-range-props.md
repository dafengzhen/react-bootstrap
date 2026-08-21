```typescript
export interface FormRangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  isInvalid?: boolean;
  isValid?: boolean;
}
```
