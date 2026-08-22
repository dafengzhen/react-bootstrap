import clsx from 'clsx';
import { forwardRef } from 'react';

import type { RowProps } from './types';

export const Row = forwardRef<HTMLElement, RowProps>(
  ({ as: Component = 'div', className, lg, md, sm, xl, xs, xxl, ...rest }, ref) => (
    <Component
      className={clsx(
        'row',
        xs && `row-cols-${xs}`,
        sm && `row-cols-sm-${sm}`,
        md && `row-cols-md-${md}`,
        lg && `row-cols-lg-${lg}`,
        xl && `row-cols-xl-${xl}`,
        xxl && `row-cols-xxl-${xxl}`,
        className,
      )}
      ref={ref}
      {...rest}
    />
  ),
);

Row.displayName = 'Row';

export default Row;
