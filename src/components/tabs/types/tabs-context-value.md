```typescript
export interface TabsContextValue {
  activeEventKey?: EventKey;
  id?: string;
  onSelect: (eventKey: EventKey, event: SyntheticEvent) => void;
  transition: boolean;
}
```
