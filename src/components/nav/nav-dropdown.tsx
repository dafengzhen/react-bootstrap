import clsx from 'clsx';
import {
  forwardRef,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
  useCallback,
  useState,
} from 'react';

import type { DropdownToggleSource } from '../dropdown';
import type { EventKey, NavDropdownProps } from './types';

import { Dropdown, DropdownMenu, useDropdown } from '../dropdown';
import { useNav } from './nav-context';
import { NavItem } from './nav-item';
import { NavLink } from './nav-link';
import { isSameKey } from './nav-utils';

interface NavDropdownToggleProps {
  active?: boolean;
  children: ReactNode;
  disabled?: boolean;
  id?: string;
}

const NavDropdownToggle = forwardRef<HTMLElement, NavDropdownToggleProps>(
  ({ active = false, children, disabled = false, id }, ref) => {
    const dropdown = useDropdown();
    const show = dropdown?.show ?? false;

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (disabled) {
        return;
      }
      const source: DropdownToggleSource = event.detail === 0 ? 'keydown' : 'click';
      dropdown?.toggle(!show, event, source);
      event.preventDefault();
    };

    const setRefs = (element: HTMLElement | null) => {
      dropdown?.setToggle(element, id);
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <NavLink
        active={active}
        aria-expanded={show}
        aria-haspopup="menu"
        className="dropdown-toggle"
        disabled={disabled}
        id={id}
        onClick={handleClick}
        ref={setRefs}
        type="button"
      >
        {children}
      </NavLink>
    );
  },
);

NavDropdownToggle.displayName = 'NavDropdownToggle';

export const NavDropdown = forwardRef<HTMLElement, NavDropdownProps>(
  (
    {
      align,
      autoClose = true,
      children,
      className,
      defaultShow = false,
      disabled = false,
      drop = 'down',
      eventKey,
      flip = true,
      focusFirstItemOnShow = false,
      id,
      menuVariant,
      onSelect,
      onToggle,
      popperConfig,
      renderMenuOnMount = false,
      show,
      title,
      ...rest
    },
    ref,
  ) => {
    const nav = useNav();
    const [lastActiveKey, setLastActiveKey] = useState<EventKey | undefined>();

    const isActive =
      nav !== null &&
      nav.activeEventKey != null &&
      (isSameKey(nav.activeEventKey, eventKey) || isSameKey(nav.activeEventKey, lastActiveKey));

    const handleSelect = useCallback(
      (key: EventKey | null, event: SyntheticEvent) => {
        if (key != null) {
          setLastActiveKey(key);
        }
        onSelect?.(key, event);
        if (event.defaultPrevented) {
          return;
        }
        nav?.onSelect(key, event);
      },
      [nav, onSelect],
    );

    return (
      <Dropdown
        align={align}
        as={NavItem}
        autoClose={autoClose}
        className={clsx(isActive && 'active', className)}
        defaultShow={defaultShow}
        drop={drop}
        flip={flip}
        focusFirstItemOnShow={focusFirstItemOnShow}
        onSelect={handleSelect}
        onToggle={onToggle}
        popperConfig={popperConfig}
        ref={ref}
        renderMenuOnMount={renderMenuOnMount}
        show={show}
        {...rest}
      >
        <NavDropdownToggle active={isActive} disabled={disabled} id={id}>
          {title}
        </NavDropdownToggle>
        <DropdownMenu variant={menuVariant}>{children}</DropdownMenu>
      </Dropdown>
    );
  },
);

NavDropdown.displayName = 'NavDropdown';

export default NavDropdown;
