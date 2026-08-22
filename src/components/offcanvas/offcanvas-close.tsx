import clsx from 'clsx';
import { forwardRef, type MouseEvent, useCallback } from 'react';

import type { OffcanvasCloseProps } from './types';

import { useOffcanvas } from './offcanvas-context';

export const OffcanvasClose = forwardRef<HTMLButtonElement, OffcanvasCloseProps>(
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
    const { close } = useOffcanvas();
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
        className={clsx('btn-close', className)}
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

OffcanvasClose.displayName = 'OffcanvasClose';

export default OffcanvasClose;
