import clsx from 'clsx';
import { forwardRef } from 'react';

import type { AlertHeadingProps } from './types';

export const AlertHeading = forwardRef<HTMLElement, AlertHeadingProps>(
  ({ as: Component = 'h4', children, className, ...rest }, ref) => (
    <Component className={clsx('alert-heading', className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

AlertHeading.displayName = 'AlertHeading';

export default AlertHeading;
