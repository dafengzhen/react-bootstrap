import type { MouseEvent } from 'react';

import clsx from 'clsx';
import { forwardRef, useCallback } from 'react';

import type { ModalCloseProps } from './types';

import { useModal } from './context';
import styles from './modal.module.css';

export const ModalClose = forwardRef<HTMLButtonElement, ModalCloseProps>(
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
    const { close } = useModal();
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
        className={clsx(styles.modalClose, className)}
        onClick={handleClick}
        ref={ref}
        type={type}
        {...rest}
      >
        {children || '✕'}
      </button>
    );
  },
);

ModalClose.displayName = 'ModalClose';

export default ModalClose;
