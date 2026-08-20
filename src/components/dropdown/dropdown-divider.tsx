import clsx from 'clsx';
import { forwardRef } from 'react';

import type { DropdownDividerProps } from './types';

export const DropdownDivider = forwardRef<HTMLElement, DropdownDividerProps>(
  ({ as: Component = 'hr', className, ...rest }, ref) => (
    <Component className={clsx('dropdown-divider', className)} ref={ref} {...rest} />
  ),
);

DropdownDivider.displayName = 'DropdownDivider';

export default DropdownDivider;
