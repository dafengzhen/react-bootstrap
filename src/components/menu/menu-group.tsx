import clsx from 'clsx';
import { forwardRef } from 'react';

import type { MenuGroupProps } from './types';

import { useMenu } from './menu-context';
import { renderMenuChildren } from './menu-utils';
import styles from './menu.module.css';

export const MenuGroup = forwardRef<HTMLElement, MenuGroupProps>(
  ({ as: Component = 'li', children, className, label, ...rest }, ref) => {
    const menu = useMenu();

    return (
      <Component className={clsx(styles.group, className)} ref={ref} role="none" {...rest}>
        {menu?.inlineCollapsed && menu.popup === false ? null : (
          <div className={styles.groupLabel}>{label}</div>
        )}
        <ul className={styles.groupList} role="menu">
          {renderMenuChildren(children, (menu?.level ?? 0) + 1)}
        </ul>
      </Component>
    );
  },
);

MenuGroup.displayName = 'MenuGroup';

export default MenuGroup;
