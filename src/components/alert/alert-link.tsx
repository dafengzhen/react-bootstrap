import clsx from 'clsx';
import { forwardRef } from 'react';

import type { AlertLinkProps } from './types';

export const AlertLink = forwardRef<HTMLAnchorElement, AlertLinkProps>(
  ({ as: Component = 'a', children, className, href = '#', ...rest }, ref) => (
    <Component className={clsx('alert-link', className)} href={href} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

AlertLink.displayName = 'AlertLink';

export default AlertLink;
