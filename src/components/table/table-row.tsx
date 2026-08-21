import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TableRowProps } from './types';

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ active = false, as: Component = 'tr', children, className, variant, ...rest }, ref) => (
    <Component
      className={
        clsx(active && 'table-active', variant && `table-${variant}`, className) || undefined
      }
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

TableRow.displayName = 'TableRow';

export default TableRow;
