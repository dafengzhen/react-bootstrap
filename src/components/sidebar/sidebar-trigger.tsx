import type { MouseEvent as ReactMouseEvent } from 'react';

import clsx from 'clsx';
import { Menu } from 'lucide-react';
import { forwardRef } from 'react';

import type { SidebarTriggerProps } from './types';

import { useSidebarRequired } from './sidebar-context';
import styles from './sidebar.module.css';

export const SidebarTrigger = forwardRef<HTMLElement, SidebarTriggerProps>(
  (
    { 'aria-label': ariaLabel, as: Component = 'button', children, className, onClick, ...rest },
    ref,
  ) => {
    const { collapsed, isMobile, mobileOpen, setMobileOpen, toggleCollapsed } =
      useSidebarRequired();

    const defaultLabel = isMobile
      ? mobileOpen
        ? '关闭侧边栏'
        : '打开侧边栏'
      : collapsed
        ? '展开侧边栏'
        : '收起侧边栏';

    const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      if (isMobile) {
        setMobileOpen(!mobileOpen);
      } else {
        toggleCollapsed();
      }
    };

    return (
      <Component
        aria-expanded={isMobile ? mobileOpen : !collapsed}
        aria-label={ariaLabel ?? defaultLabel}
        className={clsx(styles.trigger, className)}
        onClick={handleClick}
        ref={ref}
        type={Component === 'button' ? 'button' : undefined}
        {...rest}
      >
        <Menu aria-hidden="true" className={styles.triggerIcon} />
        {children != null && <span className={styles.triggerLabel}>{children}</span>}
      </Component>
    );
  },
);

SidebarTrigger.displayName = 'SidebarTrigger';

export default SidebarTrigger;
