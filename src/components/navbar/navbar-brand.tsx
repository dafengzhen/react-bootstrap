import clsx from 'clsx';
import { forwardRef } from 'react';

import type { NavbarBrandProps } from './types';

export const NavbarBrand = forwardRef<HTMLElement, NavbarBrandProps>(
  ({ as, children, className, href, ...rest }, ref) => {
    const Component = as ?? (href ? 'a' : 'span');

    return (
      <Component className={clsx('navbar-brand', className)} href={href} ref={ref} {...rest}>
        {children}
      </Component>
    );
  },
);

NavbarBrand.displayName = 'NavbarBrand';

export default NavbarBrand;
