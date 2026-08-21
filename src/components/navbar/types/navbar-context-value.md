```typescript
export interface NavbarContextValue {
  expand?: boolean | NavbarExpand;
  expanded: boolean;
  onSelect: (eventKey: EventKey, event: SyntheticEvent) => void;
  onToggle: () => void;
}
```
