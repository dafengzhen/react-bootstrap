import clsx from 'clsx';
import { forwardRef } from 'react';

import type { AbbrProps } from './types';

export const Abbr = forwardRef<HTMLElement, AbbrProps>(
  ({ as: Component = 'abbr', children, className, initialism = false, ...rest }, ref) => (
    <Component className={clsx(initialism && 'initialism', className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

Abbr.displayName = 'Abbr';

export default Abbr;
