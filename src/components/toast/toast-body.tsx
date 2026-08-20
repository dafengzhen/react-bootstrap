import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ToastBodyProps } from './types';

export const ToastBody = forwardRef<HTMLDivElement, ToastBodyProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx('toast-body', className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

ToastBody.displayName = 'ToastBody';

export default ToastBody;
