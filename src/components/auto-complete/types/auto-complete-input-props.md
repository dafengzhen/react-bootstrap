```typescript
export interface AutoCompleteInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputRef?: (element: HTMLInputElement | null) => void;
  referenceElementRef?: (element: HTMLElement | null) => void;
}
```
