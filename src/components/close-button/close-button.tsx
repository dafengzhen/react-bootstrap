import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CloseButtonProps } from './types';

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  (
    {
      'aria-label': ariaLabel = 'Close',
      className,
      disabled = false,
      type = 'button',
      variant,
      ...rest
    },
    ref,
  ) => (
    <button
      aria-label={ariaLabel}
      className={clsx('btn-close', variant && `btn-close-${variant}`, className)}
      disabled={disabled}
      ref={ref}
      type={type}
      {...rest}
    />
  ),
);

CloseButton.displayName = 'CloseButton';

export default CloseButton;
