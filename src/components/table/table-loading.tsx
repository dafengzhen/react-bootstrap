import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TableLoadingProps } from './types';

import { TableCell } from './table-cell';
import { TableRow } from './table-row';

export const TableLoading = forwardRef<HTMLTableRowElement, TableLoadingProps>(
  ({ cellClassName, children, className, colSpan, ...rest }, ref) => (
    <TableRow className={clsx('table-loading', className)} ref={ref} {...rest}>
      <TableCell
        className={clsx('py-4 text-center text-body-secondary', cellClassName)}
        colSpan={colSpan}
      >
        <output className="d-flex align-items-center justify-content-center gap-2">
          <span aria-hidden="true" className="spinner-border spinner-border-sm" />
          {children}
        </output>
      </TableCell>
    </TableRow>
  ),
);

TableLoading.displayName = 'TableLoading';

export default TableLoading;
