import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ListGroupProps } from './types';

export const ListGroup = forwardRef<HTMLElement, ListGroupProps>(
  (
    {
      as: Component = 'ul',
      children,
      className,
      flush = false,
      horizontal,
      numbered = false,
      ...rest
    },
    ref,
  ) => (
    <Component
      className={clsx(
        'list-group',
        flush && 'list-group-flush',
        numbered && 'list-group-numbered',
        horizontal === true && 'list-group-horizontal',
        typeof horizontal === 'string' && `list-group-horizontal-${horizontal}`,
        className,
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

ListGroup.displayName = 'ListGroup';

export default ListGroup;
