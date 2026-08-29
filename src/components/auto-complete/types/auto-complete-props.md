```typescript
export interface AutoCompleteProps<T extends AutoCompleteOption> extends Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'id' | 'onBlur' | 'onChange' | 'onFocus' | 'onKeyDown'
> {
  align?: AutoCompleteAlign;
  allowNew?: AutoCompleteAllowNew<T>;
  as?: ElementType;
  autoFocus?: boolean;
  caseSensitive?: boolean;
  children?: ((props: AutoCompleteRenderProps<T>) => ReactNode) | ReactNode;
  clearButton?: boolean;
  className?: string;
  defaultInputValue?: string;
  defaultOpen?: boolean;
  defaultSelected?: T[];
  disabled?: boolean;
  dropup?: boolean;
  emptyLabel?: ReactNode;
  flip?: boolean;
  highlightOnlyResult?: boolean;
  id: string | number;
  ignoreDiacritics?: boolean;
  inputProps?: AutoCompleteInputProps;
  isInvalid?: boolean;
  isValid?: boolean;
  labelKey?: AutoCompleteLabelKey<T>;
  maxHeight?: string;
  maxResults?: number;
  minLength?: number;
  multiple?: boolean;
  newSelectionPrefix?: ReactNode;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onChange?: (selected: T[]) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onInputChange?: (text: string, event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onMenuToggle?: (show: boolean) => void;
  open?: boolean;
  options: readonly T[];
  placeholder?: string;
  renderInput?: (
    inputProps: AutoCompleteInputProps,
    state: AutoCompleteRenderProps<T>,
  ) => ReactNode;
  renderMenu?: (
    results: T[],
    menuProps: AutoCompleteMenuProps,
    state: AutoCompleteRenderProps<T>,
  ) => ReactNode;
  renderMenuItemChildren?: (
    option: T,
    props: AutoCompleteMenuItemRenderProps,
    index: number,
  ) => ReactNode;
  renderToken?: (option: T, props: AutoCompleteTokenProps, index: number) => ReactNode;
  selectHint?: AutoCompleteSelectHint;
  selectHintOnEnter?: boolean;
  selected?: T[];
  size?: AutoCompleteSize;
}
```
