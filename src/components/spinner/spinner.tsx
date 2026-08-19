import clsx from 'clsx';
import { forwardRef } from 'react';

import type { SpinnerProps } from './types';

export const Spinner = forwardRef<HTMLElement, SpinnerProps>(
  (
    {
      animation = 'border',
      as: Component = 'div',
      children,
      className,
      role = 'status',
      size,
      variant,
      ...rest
    },
    ref,
  ) => (
    <Component
      className={clsx(
        `spinner-${animation}`,
        size && `spinner-${animation}-${size}`,
        variant && `text-${variant}`,
        className,
      )}
      ref={ref}
      role={role}
      {...rest}
    >
      {children}
    </Component>
  ),
);

Spinner.displayName = 'Spinner';

export default Spinner;
