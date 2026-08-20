```typescript
export interface ScrollSpyProps {
  activeId?: string;
  children?: ReactNode;
  defaultActiveId?: string;
  onActivate?: (activeId: string | null, link: HTMLElement | null) => void;
  rootMargin?: string;
  smoothScroll?: boolean;
  target?: string;
  threshold?: number | number[];
}
```
