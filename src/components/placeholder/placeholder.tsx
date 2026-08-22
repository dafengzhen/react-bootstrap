import { forwardRef } from 'react';

import type { PlaceholderProps } from './types';

import { resolvePlaceholderClassName } from './utils';

export const Placeholder = forwardRef<HTMLElement, PlaceholderProps>(
  ({ animation, as: Component = 'span', bg, children, className, size, xs, ...rest }, ref) => (
    <Component
      className={resolvePlaceholderClassName(className, animation, bg, size, xs)}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

Placeholder.displayName = 'Placeholder';

export default Placeholder;
