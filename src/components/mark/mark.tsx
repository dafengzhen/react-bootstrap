import { forwardRef } from 'react';

import type { MarkProps } from './types';

export const Mark = forwardRef<HTMLElement, MarkProps>(
  ({ as: Component = 'mark', children, className, ...rest }, ref) => (
    <Component className={className} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

Mark.displayName = 'Mark';

export default Mark;
