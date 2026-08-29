```typescript
export interface AutoCompleteContextValue {
  activeIndex: number;
  hintText: string;
  id: string | number;
  inputNode: HTMLInputElement | null;
  labelKey: AutoCompleteLabelKey<AutoCompleteOption>;
  onActiveIndexChange: (index: number) => void;
  onItemClick: (option: AutoCompleteOption) => void;
  text: string;
}
```
