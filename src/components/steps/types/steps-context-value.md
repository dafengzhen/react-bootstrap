```typescript
export interface StepsContextValue {
  active: number;
  clickable: boolean;
  direction: StepsDirection;
  handleSelect: (index: number) => void;
  variant: StepsVariant;
}
```
