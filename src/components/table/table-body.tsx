import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TableSectionProps } from './types';

export const TableBody = forwardRef<HTMLElement, TableSectionProps>(
  ({ as: Component = 'tbody', children, className, variant, ...rest }, ref) => (
    <Component
      className={clsx(variant && `table-${variant}`, className) || undefined}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

TableBody.displayName = 'TableBody';

export default TableBody;
