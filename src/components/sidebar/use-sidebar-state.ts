import { useCallback, useMemo, useState } from 'react';

import type { SidebarBreakpoint, SidebarContextValue, SidebarStateProps } from './types';

import { useMediaQuery } from '../../hooks/use-media-query';

const BREAKPOINT_MIN_WIDTHS: Record<SidebarBreakpoint, number> = {
  lg: 992,
  md: 768,
  sm: 576,
  xl: 1200,
  xxl: 1400,
};

const getBreakpointQuery = (breakpoint: null | SidebarBreakpoint): string =>
  breakpoint === null
    ? '(max-width: 0px)'
    : `(max-width: ${BREAKPOINT_MIN_WIDTHS[breakpoint] - 0.02}px)`;

export const useSidebarState = ({
  breakpoint = 'md',
  collapsed: collapsedProp,
  collapseOnSelect = true,
  defaultCollapsed = false,
  defaultOpen = false,
  onCollapsedChange,
  onItemSelect,
  onOpenChange,
  open: openProp,
  placement = 'start',
  variant = 'light',
}: SidebarStateProps): SidebarContextValue => {
  const [collapsedState, setCollapsedState] = useState(defaultCollapsed);
  const [openState, setOpenState] = useState(defaultOpen);
  const isCollapsedControlled = collapsedProp !== undefined;
  const isOpenControlled = openProp !== undefined;
  const collapsed = isCollapsedControlled ? collapsedProp : collapsedState;
  const mobileOpen = isOpenControlled ? openProp : openState;
  const isMobile = useMediaQuery(getBreakpointQuery(breakpoint));

  const setMobileOpen = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) {
        setOpenState(next);
      }
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange],
  );

  const toggleCollapsed = useCallback(() => {
    const next = !collapsed;
    if (!isCollapsedControlled) {
      setCollapsedState(next);
    }
    onCollapsedChange?.(next);
  }, [collapsed, isCollapsedControlled, onCollapsedChange]);

  return useMemo<SidebarContextValue>(
    () => ({
      breakpoint,
      collapsed,
      collapseOnSelect,
      isMobile,
      mobileOpen,
      onItemSelect,
      placement,
      setMobileOpen,
      toggleCollapsed,
      variant,
    }),
    [
      breakpoint,
      collapseOnSelect,
      collapsed,
      isMobile,
      mobileOpen,
      onItemSelect,
      placement,
      setMobileOpen,
      toggleCollapsed,
      variant,
    ],
  );
};
