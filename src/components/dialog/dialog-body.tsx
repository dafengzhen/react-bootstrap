import clsx from 'clsx';
import { forwardRef } from 'react';

import type { DialogBodyProps } from './types';

import styles from './dialog.module.css';

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ children, className, ...rest }, ref) => (
    <div className={clsx(styles.dialogBody, className)} ref={ref} {...rest}>
      {children}
    </div>
  ),
);

DialogBody.displayName = 'DialogBody';

export default DialogBody;
