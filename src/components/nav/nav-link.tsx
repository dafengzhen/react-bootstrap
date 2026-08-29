import clsx from 'clsx';
import { forwardRef, type MouseEvent } from 'react';

import type { NavLinkProps } from './types';

import { useNav, useTabs } from './nav-context';
import { isSameKey } from './nav-utils';

export const NavLink = forwardRef<HTMLElement, NavLinkProps>(
  (
    {
      active = false,
      as: Component,
      children,
      className,
      disabled = false,
      eventKey,
      href,
      onClick,
      onSelect,
      role,
      type,
      ...rest
    },
    ref,
  ) => {
    const nav = useNav();
    const tabs = useTabs();
    const key = eventKey ?? href ?? null;
    const isActive =
      active ||
      (nav !== null &&
        nav.activeEventKey != null &&
        key != null &&
        isSameKey(nav.activeEventKey, key));
    const Tag = Component ?? (href === undefined ? 'button' : 'a');
    const isButton = Tag === 'button';
    const isLink = Tag === 'a';
    const isTab = role ?? (nav?.role === 'tablist' ? 'tab' : undefined);

    const linkId = tabs?.id && key != null ? `${tabs.id}-tab-${key}` : undefined;
    const paneId = tabs?.id && key != null ? `${tabs.id}-tabpane-${key}` : undefined;

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      if (href === '#') {
        event.preventDefault();
      }
      if (onSelect) {
        onSelect(key, event);
      } else if (!event.isPropagationStopped()) {
        nav?.onSelect(key, event);
      }
    };

    return (
      <Tag
        aria-controls={isTab ? paneId : undefined}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled ? true : undefined}
        aria-selected={isTab ? isActive : undefined}
        className={clsx('nav-link', isActive && 'active', disabled && 'disabled', className)}
        id={linkId}
        onClick={handleClick}
        ref={ref}
        role={isTab}
        tabIndex={disabled && isLink ? -1 : undefined}
        {...(isButton ? { disabled, type: type ?? 'button' } : {})}
        {...(isLink && href !== undefined ? { href } : {})}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

NavLink.displayName = 'NavLink';

export default NavLink;
