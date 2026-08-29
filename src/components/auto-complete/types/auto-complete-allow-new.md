```typescript
export type AutoCompleteAllowNew<T extends AutoCompleteOption> =
  ((results: T[], context: AutoCompleteFilterContext<T>) => boolean) | boolean;
```
