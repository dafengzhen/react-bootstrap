import clsx from 'clsx';
import { forwardRef } from 'react';

import type { DialogTitleProps } from './types';

import { useDialog } from './context';
import styles from './dialog.module.css';

export const DialogTitle = forwardRef<HTMLElement, DialogTitleProps>(
  ({ as: Component = 'h2', children, className, id, ...rest }, ref) => {
    const { titleId } = useDialog();
    return (
      <Component
        className={clsx('modal-title', styles.dialogTitle, className)}
        id={id || titleId}
        ref={ref}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

DialogTitle.displayName = 'DialogTitle';

export default DialogTitle;
