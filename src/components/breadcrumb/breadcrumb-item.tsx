import clsx from 'clsx';
import { forwardRef } from 'react';

import type { BreadcrumbItemProps } from './types';

export const BreadcrumbItem = forwardRef<HTMLElement, BreadcrumbItemProps>(
  ({ active = false, as: Component = 'li', children, className, href, ...rest }, ref) => (
    <Component
      aria-current={active ? 'page' : undefined}
      className={clsx('breadcrumb-item', active && 'active', className)}
      ref={ref}
      {...rest}
    >
      {!active && href !== undefined ? <a href={href}>{children}</a> : children}
    </Component>
  ),
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

export default BreadcrumbItem;
