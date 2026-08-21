import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TableSectionProps } from './types';

export const TableFooter = forwardRef<HTMLElement, TableSectionProps>(
  ({ as: Component = 'tfoot', children, className, variant, ...rest }, ref) => (
    <Component
      className={clsx(variant && `table-${variant}`, className) || undefined}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

TableFooter.displayName = 'TableFooter';

export default TableFooter;
