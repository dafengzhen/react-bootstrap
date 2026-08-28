import clsx from 'clsx';
import { forwardRef } from 'react';

import type { SidebarDividerProps } from './types';

import styles from './sidebar.module.css';

export const SidebarDivider = forwardRef<HTMLHRElement, SidebarDividerProps>(
  ({ className, ...rest }, ref) => (
    <hr className={clsx(styles.divider, className)} ref={ref} {...rest} />
  ),
);

SidebarDivider.displayName = 'SidebarDivider';

export default SidebarDivider;
