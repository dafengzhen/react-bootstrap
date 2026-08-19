import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ModalBodyProps } from './types';

import styles from './modal.module.css';

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      className={clsx('modal-body', 'overflow-y-auto', styles.modalBody, className)}
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  ),
);

ModalBody.displayName = 'ModalBody';

export default ModalBody;
