import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TableResponsiveProps } from './types';

export const TableResponsive = forwardRef<HTMLDivElement, TableResponsiveProps>(
  ({ as: Component = 'div', breakpoint, children, className, ...rest }, ref) => (
    <Component
      className={clsx(
        'table-responsive',
        typeof breakpoint === 'string' && `table-responsive-${breakpoint}`,
        className,
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

TableResponsive.displayName = 'TableResponsive';

export default TableResponsive;
