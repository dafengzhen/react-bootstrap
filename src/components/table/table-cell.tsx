import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TableCellProps } from './types';

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ active = false, align, as: Component = 'td', children, className, variant, ...rest }, ref) => (
    <Component
      className={
        clsx(
          active && 'table-active',
          align && `align-${align}`,
          variant && `table-${variant}`,
          className,
        ) || undefined
      }
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

TableCell.displayName = 'TableCell';

export default TableCell;
