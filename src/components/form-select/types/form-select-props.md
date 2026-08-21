```typescript
export interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  htmlSize?: number;
  isInvalid?: boolean;
  isValid?: boolean;
  size?: FormSelectSize;
}
```
