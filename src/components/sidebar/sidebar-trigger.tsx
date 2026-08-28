import type { MouseEvent as ReactMouseEvent } from 'react';

import clsx from 'clsx';
import { forwardRef } from 'react';

import type { SidebarTriggerProps } from './types';

import { useSidebarRequired } from './sidebar-context';
import styles from './sidebar.module.css';

const MENU_ICON_PATH = 'M2 3.5h12v1.25H2V3.5zm0 4.125h12v1.25H2V7.625zm0 4.125h12v1.25H2v-1.25z';

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
        <svg
          aria-hidden="true"
          className={styles.triggerIcon}
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d={MENU_ICON_PATH} />
        </svg>
        {children != null && <span className={styles.triggerLabel}>{children}</span>}
      </Component>
    );
  },
);

SidebarTrigger.displayName = 'SidebarTrigger';

export default SidebarTrigger;
