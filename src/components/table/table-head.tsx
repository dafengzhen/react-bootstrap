import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TableSectionProps } from './types';

export const TableHead = forwardRef<HTMLElement, TableSectionProps>(
  ({ as: Component = 'thead', children, className, variant, ...rest }, ref) => (
    <Component
      className={clsx(variant && `table-${variant}`, className) || undefined}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

TableHead.displayName = 'TableHead';

export default TableHead;
