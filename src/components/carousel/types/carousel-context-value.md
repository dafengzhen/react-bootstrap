```typescript
export interface CarouselContextValue {
  activeIndex: number;
  autoPlaying: boolean;
  direction: CarouselDirection | null;
  duration: number;
  fade: boolean;
  goTo: (index: number, direction?: CarouselDirection) => void;
  itemCount: number;
  next: () => void;
  notifySlideEnd: () => void;
  pause: () => void;
  paused: boolean;
  pendingIndex: null | number;
  play: () => void;
  prev: () => void;
  registerItemInterval: (index: number, interval: number | undefined) => void;
  setItemCount: (count: number) => void;
  status: CarouselAnimationStatus;
  wrap: boolean;
}
```
