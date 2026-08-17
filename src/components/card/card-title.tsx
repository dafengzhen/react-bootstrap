import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CardTitleProps } from './types';

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx('card-title', 'h5', className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

CardTitle.displayName = 'CardTitle';

export default CardTitle;
