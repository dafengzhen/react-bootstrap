```typescript
export interface AutoCompleteFilterContext<T extends AutoCompleteOption> {
  allowNew: AutoCompleteAllowNew<T>;
  caseSensitive: boolean;
  ignoreDiacritics: boolean;
  labelKey: AutoCompleteLabelKey<T>;
  text: string;
}
```
