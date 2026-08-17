import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CardTextProps } from './types';

export const CardText = forwardRef<HTMLParagraphElement, CardTextProps>(
  ({ children, className, ...rest }, ref) => (
    <p className={clsx('card-text', className)} ref={ref} {...rest}>
      {children}
    </p>
  ),
);

CardText.displayName = 'CardText';

export default CardText;
