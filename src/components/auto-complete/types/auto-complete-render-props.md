```typescript
export interface AutoCompleteRenderProps<T extends AutoCompleteOption = AutoCompleteOption> {
  activeIndex: number;
  getInputProps: (props?: AutoCompleteInputProps) => AutoCompleteInputProps;
  hideMenu: () => void;
  isMenuShown: boolean;
  labelKey: AutoCompleteLabelKey<AutoCompleteOption>;
  onClear: () => void;
  onRemove: (option: AutoCompleteOption) => void;
  results: T[];
  selected: T[];
  text: string;
  toggleMenu: () => void;
}
```
