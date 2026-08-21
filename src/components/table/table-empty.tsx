import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TableEmptyProps } from './types';

import { TableCell } from './table-cell';
import { TableRow } from './table-row';

export const TableEmpty = forwardRef<HTMLTableRowElement, TableEmptyProps>(
  ({ cellClassName, children, className, colSpan, ...rest }, ref) => (
    <TableRow className={clsx('table-empty', className)} ref={ref} {...rest}>
      <TableCell
        className={clsx('py-4 text-center text-body-secondary', cellClassName)}
        colSpan={colSpan}
      >
        {children}
      </TableCell>
    </TableRow>
  ),
);

TableEmpty.displayName = 'TableEmpty';

export default TableEmpty;
