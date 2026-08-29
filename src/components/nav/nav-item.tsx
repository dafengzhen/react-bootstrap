import clsx from 'clsx';
import { forwardRef } from 'react';

import type { NavItemProps } from './types';

import { useNav } from './nav-context';

export const NavItem = forwardRef<HTMLElement, NavItemProps>(
  ({ as: Component = 'li', children, className, role, ...rest }, ref) => {
    const nav = useNav();

    return (
      <Component
        className={clsx('nav-item', className)}
        ref={ref}
        role={role ?? (nav?.role === 'tablist' ? 'presentation' : undefined)}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

NavItem.displayName = 'NavItem';

export default NavItem;
