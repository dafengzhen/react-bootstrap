import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TableProps } from './types';

import { TableResponsive } from './table-responsive';

export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      align,
      as: Component = 'table',
      bordered = false,
      borderless = false,
      children,
      className,
      hover = false,
      responsive,
      size,
      striped = false,
      variant,
      ...rest
    },
    ref,
  ) => {
    const table = (
      <Component
        className={clsx(
          'table',
          align && `align-${align}`,
          bordered && 'table-bordered',
          borderless && 'table-borderless',
          hover && 'table-hover',
          size && `table-${size}`,
          striped === true && 'table-striped',
          striped === 'columns' && 'table-striped-columns',
          variant && `table-${variant}`,
          className,
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </Component>
    );

    if (!responsive) {
      return table;
    }

    return <TableResponsive breakpoint={responsive}>{table}</TableResponsive>;
  },
);

Table.displayName = 'Table';

export default Table;
