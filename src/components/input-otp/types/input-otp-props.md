```typescript
export interface InputOtpProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  as?: ElementType;
  autoComplete?: string;
  autoFocus?: boolean;
  children?: ReactNode;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  isInvalid?: boolean;
  isValid?: boolean;
  length?: number;
  name?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  password?: boolean;
  pattern?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  separator?: ReactNode;
  size?: InputOtpSize;
  value?: string;
}
```
