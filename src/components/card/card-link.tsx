import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CardLinkProps } from './types';

export const CardLink = forwardRef<HTMLAnchorElement, CardLinkProps>(
  ({ children, className, href = '#', ...rest }, ref) => (
    <a className={clsx('card-link', className)} href={href} ref={ref} {...rest}>
      {children}
    </a>
  ),
);

CardLink.displayName = 'CardLink';

export default CardLink;
