import clsx from 'clsx';
import { forwardRef, type SyntheticEvent, useCallback, useMemo, useState } from 'react';

import type { EventKey, NavContextValue, NavProps } from './types';

import { useNavbar } from '../navbar/navbar-context';
import { NavContext, useTabs } from './nav-context';

export const Nav = forwardRef<HTMLElement, NavProps>(
  (
    {
      activeKey,
      as: Component = 'ul',
      children,
      className,
      defaultActiveKey,
      fill = false,
      justify = false,
      onSelect,
      role,
      variant,
      vertical = false,
      ...rest
    },
    ref,
  ) => {
    const tabs = useTabs();
    const navbar = useNavbar();
    const [internalKey, setInternalKey] = useState<EventKey | undefined>(defaultActiveKey);

    const currentKey = tabs ? tabs.activeEventKey : activeKey != null ? activeKey : internalKey;

    const handleSelect = useCallback(
      (eventKey: EventKey, event: SyntheticEvent) => {
        (onSelect ?? (tabs ? undefined : navbar?.onSelect))?.(eventKey, event);
        if (tabs) {
          tabs.onSelect(eventKey, event);
          return;
        }
        if (activeKey == null && defaultActiveKey !== undefined) {
          setInternalKey(eventKey);
        }
      },
      [activeKey, defaultActiveKey, navbar, onSelect, tabs],
    );

    const contextValue = useMemo<NavContextValue>(
      () => ({
        activeEventKey: currentKey,
        onSelect: handleSelect,
        role: variant ? 'tablist' : undefined,
      }),
      [currentKey, handleSelect, variant],
    );

    return (
      <NavContext.Provider value={contextValue}>
        <Component
          className={clsx(
            'nav',
            navbar && 'navbar-nav',
            variant && `nav-${variant}`,
            fill && 'nav-fill',
            justify && 'nav-justified',
            vertical && (vertical === true ? 'flex-column' : `flex-${vertical}-column`),
            className,
          )}
          ref={ref}
          role={role ?? (variant ? 'tablist' : undefined)}
          {...rest}
        >
          {children}
        </Component>
      </NavContext.Provider>
    );
  },
);

Nav.displayName = 'Nav';

export default Nav;
