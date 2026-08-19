import clsx from 'clsx';
import { forwardRef } from 'react';

import type { PaginationItemProps } from './types';

export const PaginationItem = forwardRef<HTMLElement, PaginationItemProps>(
  (
    { active = false, as: Component = 'li', children, className, disabled = false, ...rest },
    ref,
  ) => (
    <Component
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled ? true : undefined}
      className={clsx('page-item', active && 'active', disabled && 'disabled', className)}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

PaginationItem.displayName = 'PaginationItem';

export default PaginationItem;
