import type { CSSProperties } from 'react';

import clsx from 'clsx';
import { forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import type { SidebarProps } from './types';

import { SidebarBackdrop } from './sidebar-backdrop';
import { SidebarContext, useSidebar, useSidebarRequired } from './sidebar-context';
import styles from './sidebar.module.css';
import { useSidebarState } from './use-sidebar-state';

const toCssLength = (value: number | string): string =>
  typeof value === 'number' ? `${value}px` : value;

const SidebarView = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      as: Component = 'aside',
      breakpoint: _breakpoint,
      children,
      className,
      collapsed: _collapsed,
      collapsedWidth = 60,
      collapseOnSelect: _collapseOnSelect,
      defaultCollapsed: _defaultCollapsed,
      defaultOpen: _defaultOpen,
      onCollapsedChange: _onCollapsedChange,
      onItemSelect: _onItemSelect,
      onOpenChange: _onOpenChange,
      open: _open,
      placement: _placement,
      style,
      variant: _variant,
      width = 256,
      ...rest
    },
    ref,
  ) => {
    const { collapsed, isMobile, mobileOpen, placement, setMobileOpen, variant } =
      useSidebarRequired();

    useEffect(() => {
      if (!isMobile || !mobileOpen) {
        return undefined;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setMobileOpen(false);
        }
      };
      const previousOverflow = document.body.style.overflow;

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = previousOverflow;
      };
    }, [isMobile, mobileOpen, setMobileOpen]);

    return (
      <>
        {isMobile ? createPortal(<SidebarBackdrop />, document.body) : null}
        <Component
          className={clsx(
            styles.sidebar,
            styles[placement],
            isMobile && styles.mobile,
            isMobile && mobileOpen && styles.mobileOpen,
            collapsed && styles.collapsed,
            className,
          )}
          data-bs-theme={variant === 'dark' ? 'dark' : undefined}
          data-collapsed={collapsed ? '' : undefined}
          data-mobile-open={isMobile && mobileOpen ? '' : undefined}
          data-placement={placement}
          data-variant={variant}
          ref={ref}
          style={
            {
              '--rbs-sidebar-collapsed-width': toCssLength(collapsedWidth),
              '--rbs-sidebar-width': toCssLength(width),
              ...style,
            } as CSSProperties
          }
          {...rest}
        >
          <div className={styles.inner}>{children}</div>
        </Component>
      </>
    );
  },
);

SidebarView.displayName = 'SidebarView';

const StandaloneSidebar = forwardRef<HTMLElement, SidebarProps>((props, ref) => {
  const contextValue = useSidebarState(props);

  return (
    <SidebarContext.Provider value={contextValue}>
      <SidebarView {...props} ref={ref} />
    </SidebarContext.Provider>
  );
});

StandaloneSidebar.displayName = 'StandaloneSidebar';

export const Sidebar = forwardRef<HTMLElement, SidebarProps>((props, ref) => {
  const parentContext = useSidebar();

  if (parentContext !== null) {
    return <SidebarView {...props} ref={ref} />;
  }

  return <StandaloneSidebar {...props} ref={ref} />;
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
