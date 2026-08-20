import clsx from 'clsx';
import { forwardRef, type MouseEvent, useCallback } from 'react';

import type { CarouselControlProps } from './types';

import styles from './carousel.module.css';
import { useCarousel } from './context';

export const CarouselControl = forwardRef<HTMLButtonElement, CarouselControlProps>(
  ({ children, className, direction, disabled, label, onClick, type = 'button', ...rest }, ref) => {
    const { activeIndex, itemCount, next, prev, wrap } = useCarousel();
    const isPrev = direction === 'prev';
    const atEdge = isPrev ? activeIndex <= 0 : activeIndex >= itemCount - 1;
    const isDisabled = disabled ?? (itemCount <= 1 || (!wrap && atEdge));

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        if (isPrev) {
          prev();
          return;
        }
        next();
      },
      [isPrev, next, onClick, prev],
    );

    return (
      <button
        className={clsx(
          isPrev ? 'carousel-control-prev' : 'carousel-control-next',
          styles.control,
          className,
        )}
        disabled={isDisabled}
        onClick={handleClick}
        ref={ref}
        type={type}
        {...rest}
      >
        {children ?? (
          <>
            <span
              aria-hidden="true"
              className={isPrev ? 'carousel-control-prev-icon' : 'carousel-control-next-icon'}
            />
            <span className="visually-hidden">{label ?? (isPrev ? 'Previous' : 'Next')}</span>
          </>
        )}
      </button>
    );
  },
);

CarouselControl.displayName = 'CarouselControl';

export default CarouselControl;
