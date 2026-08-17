import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CardSubtitleProps } from './types';

export const CardSubtitle = forwardRef<HTMLDivElement, CardSubtitleProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx('card-subtitle', 'h6', className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

CardSubtitle.displayName = 'CardSubtitle';

export default CardSubtitle;
