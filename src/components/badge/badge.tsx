import clsx from 'clsx';
import { forwardRef } from 'react';

import type { BadgeProps } from './types';

export const Badge = forwardRef<HTMLElement, BadgeProps>(
  (
    { as: Component = 'span', bg = 'primary', children, className, pill = false, text, ...rest },
    ref,
  ) => (
    <Component
      className={clsx(
        'badge',
        pill && 'rounded-pill',
        text ? `bg-${bg}` : `text-bg-${bg}`,
        text && `text-${text}`,
        className,
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

Badge.displayName = 'Badge';

export default Badge;
