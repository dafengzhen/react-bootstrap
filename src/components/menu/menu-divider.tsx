import clsx from 'clsx';
import { forwardRef } from 'react';

import type { MenuDividerProps } from './types';

import styles from './menu.module.css';

export const MenuDivider = forwardRef<HTMLElement, MenuDividerProps>(
  ({ as: Component = 'li', children, className, ...rest }, ref) => (
    <Component className={clsx(styles.dividerItem, className)} ref={ref} role="none" {...rest}>
      {children}
      <hr className={styles.divider} />
    </Component>
  ),
);

MenuDivider.displayName = 'MenuDivider';

export default MenuDivider;
