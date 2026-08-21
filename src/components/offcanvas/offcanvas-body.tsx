import clsx from 'clsx';
import { forwardRef } from 'react';

import type { OffcanvasBodyProps } from './types';

export const OffcanvasBody = forwardRef<HTMLDivElement, OffcanvasBodyProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx('offcanvas-body', className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

OffcanvasBody.displayName = 'OffcanvasBody';

export default OffcanvasBody;
