import clsx from 'clsx';
import { forwardRef } from 'react';

import type { OffcanvasTitleProps } from './types';

import { useOffcanvas } from './offcanvas-context';

export const OffcanvasTitle = forwardRef<HTMLElement, OffcanvasTitleProps>(
  ({ as: Component = 'h5', children, className, id, ...rest }, ref) => {
    const { titleId } = useOffcanvas();
    return (
      <Component
        className={clsx('offcanvas-title', className)}
        id={id || titleId}
        ref={ref}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

OffcanvasTitle.displayName = 'OffcanvasTitle';

export default OffcanvasTitle;
