import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ColProps } from './types';

import { getColSizeClasses } from './utils';

export const Col = forwardRef<HTMLElement, ColProps>(
  ({ as: Component = 'div', className, lg, md, sm, xl, xs, xxl, ...rest }, ref) => (
    <Component
      className={clsx(
        'col',
        ...getColSizeClasses('', xs),
        ...getColSizeClasses('-sm', sm),
        ...getColSizeClasses('-md', md),
        ...getColSizeClasses('-lg', lg),
        ...getColSizeClasses('-xl', xl),
        ...getColSizeClasses('-xxl', xxl),
        className,
      )}
      ref={ref}
      {...rest}
    />
  ),
);

Col.displayName = 'Col';

export default Col;
