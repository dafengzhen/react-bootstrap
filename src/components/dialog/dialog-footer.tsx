import clsx from 'clsx';
import { forwardRef } from 'react';

import type { DialogFooterProps } from './types';

import styles from './dialog.module.css';

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx('modal-footer', styles.dialogFooter, className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

DialogFooter.displayName = 'DialogFooter';

export default DialogFooter;
