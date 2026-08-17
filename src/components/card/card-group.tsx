import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CardGroupProps } from './types';

export const CardGroup = forwardRef<HTMLDivElement, CardGroupProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx('card-group', className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

CardGroup.displayName = 'CardGroup';

export default CardGroup;
