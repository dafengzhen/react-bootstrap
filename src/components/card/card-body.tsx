import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CardBodyProps } from './types';

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx('card-body', className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

CardBody.displayName = 'CardBody';

export default CardBody;
