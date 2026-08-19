import type { MouseEvent } from 'react';

import clsx from 'clsx';
import { forwardRef, useCallback } from 'react';

import type { DialogCloseProps } from './types';

import { useDialog } from './context';
import styles from './dialog.module.css';

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  (
    {
      'aria-label': ariaLabel = 'Close',
      children,
      className,
      onClick: userOnClick,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const { close } = useDialog();
    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        close();
        userOnClick?.(event);
      },
      [close, userOnClick],
    );

    return (
      <button
        aria-label={ariaLabel}
        className={clsx('btn-close', styles.dialogClose, className)}
        onClick={handleClick}
        ref={ref}
        type={type}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

DialogClose.displayName = 'DialogClose';

export default DialogClose;
