import clsx from 'clsx';
import { forwardRef, type MouseEvent } from 'react';

import type { NavbarToggleProps } from './types';

import { useNavbar } from './context';

export const NavbarToggle = forwardRef<HTMLElement, NavbarToggleProps>(
  (
    {
      'aria-label': ariaLabel,
      as: Component = 'button',
      children,
      className,
      label = 'Toggle navigation',
      onClick,
      ...rest
    },
    ref,
  ) => {
    const navbar = useNavbar();

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      onClick?.(event);
      navbar?.onToggle();
    };

    return (
      <Component
        aria-expanded={navbar?.expanded}
        aria-label={ariaLabel ?? label}
        className={clsx('navbar-toggler', !navbar?.expanded && 'collapsed', className)}
        onClick={handleClick}
        ref={ref}
        {...rest}
        {...(Component === 'button' ? { type: 'button' } : {})}
      >
        {children ?? <span className="navbar-toggler-icon" />}
      </Component>
    );
  },
);

NavbarToggle.displayName = 'NavbarToggle';

export default NavbarToggle;
