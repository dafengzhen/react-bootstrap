import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ModalFooterProps } from './types';

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx('modal-footer', className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

ModalFooter.displayName = 'ModalFooter';

export default ModalFooter;
