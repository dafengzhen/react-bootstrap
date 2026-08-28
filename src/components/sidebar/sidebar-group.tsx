import clsx from 'clsx';
import { forwardRef } from 'react';

import type { SidebarGroupContentProps, SidebarGroupLabelProps, SidebarGroupProps } from './types';

import styles from './sidebar.module.css';

export const SidebarGroup = forwardRef<HTMLElement, SidebarGroupProps>(
  ({ as: Component = 'div', children, className, ...rest }, ref) => (
    <Component className={clsx(styles.group, className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

SidebarGroup.displayName = 'SidebarGroup';

export const SidebarGroupLabel = forwardRef<HTMLElement, SidebarGroupLabelProps>(
  ({ as: Component = 'div', children, className, ...rest }, ref) => (
    <Component className={clsx(styles.groupLabel, className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

SidebarGroupLabel.displayName = 'SidebarGroupLabel';

export const SidebarGroupContent = forwardRef<HTMLElement, SidebarGroupContentProps>(
  ({ as: Component = 'div', children, className, ...rest }, ref) => (
    <Component className={clsx(styles.groupContent, className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

SidebarGroupContent.displayName = 'SidebarGroupContent';
