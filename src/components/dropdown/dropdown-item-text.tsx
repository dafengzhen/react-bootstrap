import clsx from 'clsx';
import { forwardRef } from 'react';

import type { DropdownItemTextProps } from './types';

export const DropdownItemText = forwardRef<HTMLElement, DropdownItemTextProps>(
  ({ as: Component = 'span', children, className, ...rest }, ref) => (
    <Component className={clsx('dropdown-item-text', className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

DropdownItemText.displayName = 'DropdownItemText';

export default DropdownItemText;
