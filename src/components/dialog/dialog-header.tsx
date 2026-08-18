import clsx from 'clsx';
import { forwardRef } from 'react';

import type { DialogHeaderProps } from './types';

import styles from './dialog.module.css';

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx(styles.dialogHeader, className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

DialogHeader.displayName = 'DialogHeader';

export default DialogHeader;
