import clsx from 'clsx';
import { forwardRef } from 'react';

import type { PaginationProps } from './types';

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      align,
      as: Component = 'nav',
      children,
      className,
      label = 'pagination',
      listAs: ListComponent = 'ul',
      listProps,
      size,
      ...rest
    },
    ref,
  ) => {
    const { className: listClassName, ...listRest } = listProps ?? {};

    return (
      <Component aria-label={label} className={className} ref={ref} {...rest}>
        <ListComponent
          className={clsx(
            'pagination',
            size && `pagination-${size}`,
            align && `justify-content-${align}`,
            listClassName,
          )}
          {...listRest}
        >
          {children}
        </ListComponent>
      </Component>
    );
  },
);

Pagination.displayName = 'Pagination';

export default Pagination;
