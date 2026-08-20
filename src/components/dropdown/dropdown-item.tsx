import clsx from 'clsx';
import { forwardRef, type MouseEvent } from 'react';

import type { DropdownItemProps, EventKey } from './types';

import { useDropdown } from './context';

export const DropdownItem = forwardRef<HTMLElement, DropdownItemProps>(
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
      ...rest
    },
    ref,
  ) => {
    const dropdown = useDropdown();
    const Tag = Component ?? (href === undefined ? 'button' : 'a');
    const isButton = Tag === 'button';

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      const key: EventKey | null = eventKey ?? null;
      onSelect?.(key, event);
      if (event.defaultPrevented) {
        return;
      }
      dropdown?.onSelect(key, event);
    };

    return (
      <Tag
        aria-current={active ? 'true' : undefined}
        aria-disabled={disabled ? true : undefined}
        className={clsx('dropdown-item', active && 'active', disabled && 'disabled', className)}
        href={href === undefined ? undefined : href}
        onClick={handleClick}
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : undefined}
        {...(isButton ? { disabled, type: 'button' } : {})}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
