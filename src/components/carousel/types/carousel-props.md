```typescript
export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  activeIndex?: number;
  children?: ReactNode;
  className?: string;
  defaultActiveIndex?: number;
  duration?: number;
  fade?: boolean;
  interval?: null | number;
  keyboard?: boolean;
  onSelect?: (index: number, direction: CarouselDirection) => void;
  onSlid?: (index: number, direction: CarouselDirection) => void;
  onSlide?: (index: number, direction: CarouselDirection) => void;
  pause?: CarouselPause;
  ride?: CarouselRide;
  slide?: boolean;
  style?: CarouselCssProperties;
  touch?: boolean;
  wrap?: boolean;
}
```
