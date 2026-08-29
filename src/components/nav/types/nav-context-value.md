```typescript
export interface NavContextValue {
  activeEventKey?: EventKey;
  onSelect: (eventKey: EventKey, event: SyntheticEvent) => void;
  role?: string;
}
```
