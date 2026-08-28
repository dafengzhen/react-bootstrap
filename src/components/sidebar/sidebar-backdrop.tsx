import type { MouseEvent as ReactMouseEvent } from 'react';

import clsx from 'clsx';
import { forwardRef } from 'react';

import type { SidebarBackdropProps } from './types';

import { useSidebar } from './sidebar-context';
import styles from './sidebar.module.css';

export const SidebarBackdrop = forwardRef<HTMLDivElement, SidebarBackdropProps>(
  ({ className, onClick, ...rest }, ref) => {
    const context = useSidebar();
    const mobileOpen = context?.mobileOpen ?? false;

    const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        context?.setMobileOpen(false);
      }
    };

    return (
      <div
        aria-hidden="true"
        className={clsx(styles.backdrop, mobileOpen && styles.backdropVisible, className)}
        onClick={handleClick}
        ref={ref}
        {...rest}
      />
    );
  },
);

SidebarBackdrop.displayName = 'SidebarBackdrop';

export default SidebarBackdrop;
