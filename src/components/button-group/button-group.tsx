import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ButtonGroupProps } from './types';

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, className, role = 'group', size, vertical = false, ...rest }, ref) => (
    <div
      className={clsx(
        vertical ? 'btn-group-vertical' : 'btn-group',
        size && `btn-group-${size}`,
        className,
      )}
      ref={ref}
      role={role}
      {...rest}
    >
      {children}
    </div>
  ),
);

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
