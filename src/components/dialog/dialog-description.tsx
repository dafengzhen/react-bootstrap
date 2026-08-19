import clsx from 'clsx';
import { forwardRef } from 'react';

import type { DialogDescriptionProps } from './types';

import { useDialog } from './context';
import styles from './dialog.module.css';

export const DialogDescription = forwardRef<HTMLElement, DialogDescriptionProps>(
  ({ as: Component = 'p', children, className, id, ...rest }, ref) => {
    const { descriptionId } = useDialog();
    return (
      <Component
        className={clsx('mb-0 mt-1', styles.dialogDescription, className)}
        id={id || descriptionId}
        ref={ref}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

DialogDescription.displayName = 'DialogDescription';

export default DialogDescription;
