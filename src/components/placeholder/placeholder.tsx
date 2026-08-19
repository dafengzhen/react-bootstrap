import clsx from 'clsx';
import { forwardRef } from 'react';

import type { PlaceholderProps } from './types';

export const Placeholder = forwardRef<HTMLElement, PlaceholderProps>(
  ({ animation, as: Component = 'span', bg, children, className, size, xs, ...rest }, ref) => (
    <Component
      className={clsx(
        animation ? `placeholder-${animation}` : 'placeholder',
        bg && `bg-${bg}`,
        size && `placeholder-${size}`,
        xs === 'auto' ? 'col-auto' : typeof xs === 'number' ? `col-${xs}` : xs && 'col',
        className,
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

Placeholder.displayName = 'Placeholder';

export default Placeholder;
