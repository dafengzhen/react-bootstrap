import clsx from 'clsx';
import { forwardRef } from 'react';

import type { DropdownHeaderProps } from './types';

export const DropdownHeader = forwardRef<HTMLElement, DropdownHeaderProps>(
  ({ as: Component = 'h6', children, className, ...rest }, ref) => (
    <Component className={clsx('dropdown-header', className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

DropdownHeader.displayName = 'DropdownHeader';

export default DropdownHeader;
