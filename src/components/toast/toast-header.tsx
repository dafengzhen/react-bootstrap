import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ToastHeaderProps } from './types';

import { useToast } from './context';
import { ToastClose } from './toast-close';

export const ToastHeader = forwardRef<HTMLDivElement, ToastHeaderProps>(
  ({ children, className, closeButton = true, closeLabel = 'Close', ...rest }, ref) => {
    useToast();

    return (
      <div className={clsx('toast-header', className)} ref={ref} {...rest}>
        {children}
        {closeButton ? <ToastClose aria-label={closeLabel} /> : null}
      </div>
    );
  },
);

ToastHeader.displayName = 'ToastHeader';

export default ToastHeader;
