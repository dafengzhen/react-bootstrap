import clsx from 'clsx';
import { forwardRef, type SyntheticEvent, useCallback, useMemo, useState } from 'react';

import type { EventKey } from '../tabs';
import type { NavbarContextValue, NavbarProps } from './types';

import { NavbarContext } from './context';

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      as: Component = 'nav',
      bg,
      children,
      className,
      collapseOnSelect = false,
      expand = true,
      expanded,
      fixed,
      onSelect,
      onToggle,
      role,
      sticky,
      variant,
      ...rest
    },
    ref,
  ) => {
    const [internalExpanded, setInternalExpanded] = useState(false);
    const isUncontrolled = expanded === undefined;
    const expandedState = isUncontrolled ? internalExpanded : expanded;

    const handleSelect = useCallback(
      (eventKey: EventKey, event: SyntheticEvent) => {
        onSelect?.(eventKey, event);
        if (collapseOnSelect && expandedState) {
          if (isUncontrolled) {
            setInternalExpanded(false);
          }
          onToggle?.(false);
        }
      },
      [collapseOnSelect, expandedState, isUncontrolled, onSelect, onToggle],
    );

    const contextValue = useMemo<NavbarContextValue>(
      () => ({
        expand,
        expanded: expandedState,
        onSelect: handleSelect,
        onToggle: () => {
          const nextExpanded = !expandedState;
          if (isUncontrolled) {
            setInternalExpanded(nextExpanded);
          }
          onToggle?.(nextExpanded);
        },
      }),
      [expand, expandedState, handleSelect, isUncontrolled, onToggle],
    );

    return (
      <NavbarContext.Provider value={contextValue}>
        <Component
          className={clsx(
            'navbar',
            expand && (expand === true ? 'navbar-expand' : `navbar-expand-${expand}`),
            variant && `navbar-${variant}`,
            bg && `bg-${bg}`,
            sticky && `sticky-${sticky}`,
            fixed && `fixed-${fixed}`,
            className,
          )}
          ref={ref}
          role={role ?? (Component !== 'nav' ? 'navigation' : undefined)}
          {...rest}
        >
          {children}
        </Component>
      </NavbarContext.Provider>
    );
  },
);

Navbar.displayName = 'Navbar';

export default Navbar;
