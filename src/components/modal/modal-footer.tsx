import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ModalFooterProps } from './types';

import styles from './modal.module.css';

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx(styles.modalFooter, className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

ModalFooter.displayName = 'ModalFooter';

export default ModalFooter;
