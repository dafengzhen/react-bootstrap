```typescript
export interface FormCheckInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  indeterminate?: boolean;
  isInvalid?: boolean;
  isValid?: boolean;
  type?: 'checkbox' | 'radio';
}
```
