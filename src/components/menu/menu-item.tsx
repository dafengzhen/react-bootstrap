import clsx from 'clsx';
import { forwardRef, type MouseEvent } from 'react';

import type { MenuItemProps } from './types';

import { useMenu } from './menu-context';
import { isSameKey } from './menu-utils';
import styles from './menu.module.css';

export const MenuItem = forwardRef<HTMLElement, MenuItemProps>(
  (
    {
      as: Component = 'li',
      children,
      className,
      danger = false,
      disabled = false,
      eventKey,
      icon,
      onClick,
      onSelect,
      title,
      ...rest
    },
    ref,
  ) => {
    const menu = useMenu();
    const key = eventKey ?? null;
    const isActive =
      menu !== null &&
      key !== null &&
      menu.activeKeys.some((activeKey) => isSameKey(activeKey, key));
    const collapsed = menu?.inlineCollapsed === true && menu.popup === false;
    const resolvedTitle =
      title ?? (collapsed && typeof children === 'string' ? children : undefined);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      onSelect?.(key, event);
      if (event.defaultPrevented) {
        return;
      }
      menu?.onItemSelect(key, event);
    };

    return (
      <Component
        aria-disabled={disabled ? true : undefined}
        className={clsx(
          styles.item,
          isActive && styles.itemActive,
          disabled && styles.itemDisabled,
          danger && styles.itemDanger,
          collapsed && styles.itemCollapsed,
          className,
        )}
        data-menu-entry="item"
        onClick={handleClick}
        ref={ref}
        role="menuitem"
        tabIndex={-1}
        title={resolvedTitle}
        {...rest}
      >
        {icon !== undefined && icon !== null && <span className={styles.itemIcon}>{icon}</span>}
        <span className={styles.itemLabel}>{children}</span>
      </Component>
    );
  },
);

MenuItem.displayName = 'MenuItem';

export default MenuItem;
