import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CarouselCaptionProps } from './types';

export const CarouselCaption = forwardRef<HTMLDivElement, CarouselCaptionProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx('carousel-caption', className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

CarouselCaption.displayName = 'CarouselCaption';

export default CarouselCaption;
