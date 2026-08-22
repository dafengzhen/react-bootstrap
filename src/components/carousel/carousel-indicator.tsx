import clsx from 'clsx';
import { forwardRef, type MouseEvent, useCallback } from 'react';

import type { CarouselIndicatorProps } from './types';

import { useCarousel } from './carousel-context';
import styles from './carousel.module.css';

export const CarouselIndicator = forwardRef<HTMLButtonElement, CarouselIndicatorProps>(
  (
    { 'aria-label': ariaLabel, children, className, index, onClick, type = 'button', ...rest },
    ref,
  ) => {
    const { activeIndex, goTo } = useCarousel();
    const isActive = index === activeIndex;

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        goTo(index);
      },
      [goTo, index, onClick],
    );

    return (
      <button
        aria-current={isActive || undefined}
        aria-label={ariaLabel ?? `Slide ${index + 1}`}
        className={clsx(styles.indicator, isActive && 'active', className)}
        data-bs-target=""
        onClick={handleClick}
        ref={ref}
        type={type}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

CarouselIndicator.displayName = 'CarouselIndicator';

export default CarouselIndicator;
