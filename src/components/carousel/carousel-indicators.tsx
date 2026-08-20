import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CarouselIndicatorsProps } from './types';

import { CarouselIndicator } from './carousel-indicator';
import { useCarousel } from './context';

export const CarouselIndicators = forwardRef<HTMLDivElement, CarouselIndicatorsProps>(
  ({ children, className, labels, ...rest }, ref) => {
    const { itemCount } = useCarousel();

    return (
      <div className={clsx('carousel-indicators', className)} ref={ref} {...rest}>
        {children ??
          Array.from({ length: itemCount }, (_, index) => (
            <CarouselIndicator aria-label={labels?.[index]} index={index} key={index} />
          ))}
      </div>
    );
  },
);

CarouselIndicators.displayName = 'CarouselIndicators';

export default CarouselIndicators;
