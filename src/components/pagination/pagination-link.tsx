import clsx from 'clsx';
import { forwardRef } from 'react';

import type { PaginationLinkProps } from './types';

export const PaginationLink = forwardRef<HTMLElement, PaginationLinkProps>(
  (
    { active = false, as: Component, children, className, disabled = false, href, ...rest },
    ref,
  ) => {
    const Tag = Component ?? (active || disabled || href === undefined ? 'span' : 'a');
    const isLink = Tag === 'a';

    return (
      <Tag
        aria-disabled={disabled && isLink ? true : undefined}
        className={clsx('page-link', className)}
        tabIndex={disabled && isLink ? -1 : undefined}
        {...(isLink && href !== undefined ? { href } : {})}
        ref={ref}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

PaginationLink.displayName = 'PaginationLink';

export default PaginationLink;
