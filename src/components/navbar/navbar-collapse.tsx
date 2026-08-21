import clsx from 'clsx';
import { forwardRef } from 'react';

import type { NavbarCollapseProps } from './types';

import { useNavbar } from './context';

export const NavbarCollapse = forwardRef<HTMLDivElement, NavbarCollapseProps>(
  ({ children, className, ...rest }, ref) => {
    const navbar = useNavbar();

    return (
      <div
        className={clsx('collapse', 'navbar-collapse', navbar?.expanded && 'show', className)}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

NavbarCollapse.displayName = 'NavbarCollapse';

export default NavbarCollapse;
