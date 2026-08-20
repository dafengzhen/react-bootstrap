import { forwardRef, type MouseEvent, useCallback } from 'react';

import type { ToastCloseProps } from './types';

import { CloseButton } from '../close-button';
import { useToast } from './context';

export const ToastClose = forwardRef<HTMLButtonElement, ToastCloseProps>(
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
    const { close, variant } = useToast();
    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        close();
        userOnClick?.(event);
      },
      [close, userOnClick],
    );

    return (
      <CloseButton
        aria-label={ariaLabel}
        className={className}
        onClick={handleClick}
        ref={ref}
        type={type}
        variant={variant !== undefined && variant !== 'light' ? 'white' : undefined}
        {...rest}
      >
        {children}
      </CloseButton>
    );
  },
);

ToastClose.displayName = 'ToastClose';

export default ToastClose;
