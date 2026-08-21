import clsx from 'clsx';
import { forwardRef } from 'react';

import type { NavbarTextProps } from './types';

export const NavbarText = forwardRef<HTMLElement, NavbarTextProps>(
  ({ as: Component = 'span', children, className, ...rest }, ref) => (
    <Component className={clsx('navbar-text', className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

NavbarText.displayName = 'NavbarText';

export default NavbarText;
