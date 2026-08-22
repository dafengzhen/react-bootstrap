import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ColProps } from './types';

import { getColClasses } from './utils';

export const Col = forwardRef<HTMLElement, ColProps>(
  ({ as: Component = 'div', className, lg, md, sm, xl, xs, xxl, ...rest }, ref) => (
    <Component
      className={clsx('col', ...getColClasses({ lg, md, sm, xl, xs, xxl }), className)}
      ref={ref}
      {...rest}
    />
  ),
);

Col.displayName = 'Col';

export default Col;
