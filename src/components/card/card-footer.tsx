import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CardFooterProps } from './types';

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx('card-footer', className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

CardFooter.displayName = 'CardFooter';

export default CardFooter;
