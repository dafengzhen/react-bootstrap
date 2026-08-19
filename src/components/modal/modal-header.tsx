import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ModalHeaderProps } from './types';

import { ModalClose } from './modal-close';

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className, closeButton = false, closeLabel, ...rest }, ref) => (
    <div className={clsx('modal-header', className)} ref={ref} {...rest}>
      {children}
      {closeButton ? <ModalClose aria-label={closeLabel} /> : null}
    </div>
  ),
);

ModalHeader.displayName = 'ModalHeader';

export default ModalHeader;
