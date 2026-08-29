import { forwardRef } from 'react';

import type { CodeProps } from './types';

export const Code = forwardRef<HTMLElement, CodeProps>(
  ({ as: Component = 'code', children, className, ...rest }, ref) => (
    <Component className={className} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

Code.displayName = 'Code';

export default Code;
