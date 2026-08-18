import clsx from 'clsx';
import { type CSSProperties, forwardRef } from 'react';

import type { BreadcrumbProps } from './types';

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      as: Component = 'nav',
      children,
      className,
      divider,
      label = 'breadcrumb',
      listAs: ListComponent = 'ol',
      listProps,
      ...rest
    },
    ref,
  ) => {
    const { className: listClassName, ...listRest } = listProps ?? {};

    return (
      <Component aria-label={label} className={className} ref={ref} {...rest}>
        <ListComponent
          className={clsx('breadcrumb', listClassName)}
          style={
            divider === undefined
              ? undefined
              : ({ '--bs-breadcrumb-divider': `'${divider}'` } as CSSProperties)
          }
          {...listRest}
        >
          {children}
        </ListComponent>
      </Component>
    );
  },
);

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
