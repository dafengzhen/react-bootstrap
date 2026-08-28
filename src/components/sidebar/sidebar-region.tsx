import clsx from 'clsx';
import { forwardRef } from 'react';

import type { SidebarRegionProps } from './types';

import styles from './sidebar.module.css';

export const SidebarHeader = forwardRef<HTMLElement, SidebarRegionProps>(
  ({ as: Component = 'header', children, className, ...rest }, ref) => (
    <Component className={clsx(styles.header, className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

SidebarHeader.displayName = 'SidebarHeader';

export const SidebarBody = forwardRef<HTMLElement, SidebarRegionProps>(
  ({ as: Component = 'div', children, className, ...rest }, ref) => (
    <Component className={clsx(styles.body, className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

SidebarBody.displayName = 'SidebarBody';

export const SidebarFooter = forwardRef<HTMLElement, SidebarRegionProps>(
  ({ as: Component = 'footer', children, className, ...rest }, ref) => (
    <Component className={clsx(styles.footer, className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

SidebarFooter.displayName = 'SidebarFooter';
