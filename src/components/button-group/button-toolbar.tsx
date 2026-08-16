import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ButtonToolbarProps } from './types';

export const ButtonToolbar = forwardRef<HTMLDivElement, ButtonToolbarProps>(
  ({ children, className, role = 'toolbar', ...rest }, ref) => (
    <div className={clsx('btn-toolbar', className)} ref={ref} role={role} {...rest}>
      {children}
    </div>
  ),
);

ButtonToolbar.displayName = 'ButtonToolbar';

export default ButtonToolbar;
