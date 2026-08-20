```typescript
export interface ScrollSpyContextValue {
  activeId: string | null;
  registerContainer: (element: HTMLElement | null) => void;
  registerLink: (targetId: string) => () => void;
  requestScroll: (targetId: string, smooth: boolean) => void;
  smoothScroll: boolean;
}
```
