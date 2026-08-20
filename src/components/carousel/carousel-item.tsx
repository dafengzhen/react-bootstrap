import clsx from 'clsx';
import { forwardRef, type TransitionEvent, useCallback, useEffect, useMemo } from 'react';

import type { CarouselItemProps, CarouselItemRole } from './types';

import styles from './carousel.module.css';
import { useCarousel, useCarouselItemIndex } from './context';

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  (
    {
      'aria-label': ariaLabel,
      children,
      className,
      index,
      interval,
      onTransitionEnd,
      role = 'group',
      ...rest
    },
    ref,
  ) => {
    const {
      activeIndex,
      direction,
      itemCount,
      notifySlideEnd,
      pendingIndex,
      registerItemInterval,
      status,
    } = useCarousel();
    const contextIndex = useCarouselItemIndex();
    const resolvedIndex = index ?? contextIndex ?? 0;

    useEffect(() => {
      registerItemInterval(resolvedIndex, interval);
      return () => {
        registerItemInterval(resolvedIndex, undefined);
      };
    }, [interval, registerItemInterval, resolvedIndex]);

    const itemRole = useMemo<CarouselItemRole>(() => {
      if (resolvedIndex === pendingIndex) {
        return 'entering';
      }
      if (resolvedIndex !== activeIndex) {
        return 'inactive';
      }
      return status === 'idle' ? 'active' : 'leaving';
    }, [activeIndex, pendingIndex, resolvedIndex, status]);

    const handleTransitionEnd = useCallback(
      (event: TransitionEvent<HTMLDivElement>) => {
        onTransitionEnd?.(event);
        if (event.target !== event.currentTarget || itemRole !== 'entering') {
          return;
        }
        if (event.propertyName !== 'opacity' && event.propertyName !== 'transform') {
          return;
        }
        notifySlideEnd();
      },
      [itemRole, notifySlideEnd, onTransitionEnd],
    );

    return (
      <div
        aria-label={ariaLabel ?? `${resolvedIndex + 1} / ${Math.max(itemCount, 1)}`}
        aria-roledescription="slide"
        className={clsx(
          'carousel-item',
          styles.item,
          resolvedIndex === activeIndex && 'active',
          className,
        )}
        data-direction={direction ?? undefined}
        data-role={itemRole}
        data-status={status}
        onTransitionEnd={handleTransitionEnd}
        ref={ref}
        role={role}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

CarouselItem.displayName = 'CarouselItem';

export default CarouselItem;
