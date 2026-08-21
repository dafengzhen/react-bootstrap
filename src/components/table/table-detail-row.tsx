import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TableDetailRowProps } from './types';

import { TableCell } from './table-cell';
import { TableRow } from './table-row';

export const TableDetailRow = forwardRef<HTMLTableRowElement, TableDetailRowProps>(
  ({ cellClassName, children, className, colSpan, ...rest }, ref) => (
    <TableRow className={clsx('table-detail-row', className)} ref={ref} {...rest}>
      <TableCell className={clsx('p-3', cellClassName)} colSpan={colSpan}>
        {children}
      </TableCell>
    </TableRow>
  ),
);

TableDetailRow.displayName = 'TableDetailRow';

export default TableDetailRow;
