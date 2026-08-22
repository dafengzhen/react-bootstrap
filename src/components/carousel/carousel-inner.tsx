import clsx from 'clsx';
import {
  Children,
  forwardRef,
  isValidElement,
  type ReactNode,
  useLayoutEffect,
  useMemo,
} from 'react';

import type { CarouselInnerProps } from './types';

import { CarouselItemIndexContext, useCarousel } from './carousel-context';

const getItemKey = (child: ReactNode, index: number) => {
  if (isValidElement(child) && child.key !== null) {
    return child.key;
  }
  return index;
};

export const CarouselInner = forwardRef<HTMLDivElement, CarouselInnerProps>(
  ({ 'aria-live': ariaLive, children, className, ...rest }, ref) => {
    const { autoPlaying, setItemCount } = useCarousel();

    const items = useMemo(() => Children.toArray(children), [children]);
    const itemCount = items.length;

    useLayoutEffect(() => {
      setItemCount(itemCount);
      return () => {
        setItemCount(0);
      };
    }, [itemCount, setItemCount]);

    return (
      <div
        aria-live={ariaLive ?? (autoPlaying ? 'off' : 'polite')}
        className={clsx('carousel-inner', className)}
        ref={ref}
        {...rest}
      >
        {items.map((child, index) => (
          <CarouselItemIndexContext.Provider key={getItemKey(child, index)} value={index}>
            {child}
          </CarouselItemIndexContext.Provider>
        ))}
      </div>
    );
  },
);

CarouselInner.displayName = 'CarouselInner';

export default CarouselInner;
