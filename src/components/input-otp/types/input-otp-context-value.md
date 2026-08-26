```typescript
export interface InputOtpContextValue {
  autoComplete: string;
  disabled: boolean;
  focusSlot: (index: number) => void;
  handleChange: (index: number, event: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
  handlePaste: (index: number, event: ClipboardEvent<HTMLInputElement>) => void;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  isInvalid: boolean;
  isValid: boolean;
  length: number;
  password: boolean;
  placeholder: string;
  readOnly: boolean;
  registerSlot: (index: number) => (element: HTMLInputElement | null) => void;
  size?: InputOtpSize;
  slots: string[];
}
```
