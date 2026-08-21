import clsx from 'clsx';
import { forwardRef } from 'react';

import type { OffcanvasHeaderProps } from './types';

import { OffcanvasClose } from './offcanvas-close';

export const OffcanvasHeader = forwardRef<HTMLDivElement, OffcanvasHeaderProps>(
  ({ children, className, closeButton = false, closeLabel, ...rest }, ref) => (
    <div className={clsx('offcanvas-header', className)} ref={ref} {...rest}>
      {children}
      {closeButton ? <OffcanvasClose aria-label={closeLabel} /> : null}
    </div>
  ),
);

OffcanvasHeader.displayName = 'OffcanvasHeader';

export default OffcanvasHeader;
