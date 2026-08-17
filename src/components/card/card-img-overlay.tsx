import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CardImgOverlayProps } from './types';

export const CardImgOverlay = forwardRef<HTMLDivElement, CardImgOverlayProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx('card-img-overlay', className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

CardImgOverlay.displayName = 'CardImgOverlay';

export default CardImgOverlay;
