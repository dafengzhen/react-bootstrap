```typescript
export interface TableEditCellProps extends HTMLAttributes<HTMLElement> {
  active?: boolean;
  align?: TableAlign;
  as?: ElementType;
  cancelLabel?: string;
  children?: ReactNode;
  className?: string;
  defaultEditing?: boolean;
  defaultValue?: TableEditValue;
  disabled?: boolean;
  editing?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value'>;
  onCancel?: () => void;
  onEditingChange?: (editing: boolean) => void;
  onSave?: (value: TableEditValue) => void;
  options?: readonly TableEditOption[];
  placeholder?: string;
  saveLabel?: string;
  selectProps?: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'>;
  textareaProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'>;
  type?: TableEditType;
  validator?: (value: TableEditValue) => string | undefined;
  value?: TableEditValue;
}
```
