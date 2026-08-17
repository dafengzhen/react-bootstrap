import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CardHeaderProps } from './types';

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx('card-header', className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

CardHeader.displayName = 'CardHeader';

export default CardHeader;
