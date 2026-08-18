import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ListGroupItemProps } from './types';

export const ListGroupItem = forwardRef<HTMLElement, ListGroupItemProps>(
  (
    {
      action = false,
      active = false,
      as: Component,
      children,
      className,
      disabled = false,
      href,
      type,
      variant,
      ...rest
    },
    ref,
  ) => {
    const Tag = Component ?? (href === undefined ? (action ? 'button' : 'li') : 'a');
    const isButton = Tag === 'button';
    const isLink = Tag === 'a';

    return (
      <Tag
        aria-current={active ? 'true' : undefined}
        aria-disabled={disabled && !isButton ? true : undefined}
        className={clsx(
          'list-group-item',
          action && 'list-group-item-action',
          active && 'active',
          disabled && 'disabled',
          variant && `list-group-item-${variant}`,
          className,
        )}
        {...(isButton ? { disabled, type: type ?? 'button' } : {})}
        {...(isLink && href !== undefined ? { href } : {})}
        ref={ref}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

ListGroupItem.displayName = 'ListGroupItem';

export default ListGroupItem;
