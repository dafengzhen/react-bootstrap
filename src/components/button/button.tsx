import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ButtonProps } from './types';

import styles from './button.module.css';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      block = false,
      children,
      className,
      disabled = false,
      loading = false,
      loadingText,
      size,
      type = 'button',
      variant = 'primary',
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        className={clsx(
          'btn',
          `btn-${variant}`,
          size && `btn-${size}`,
          block && 'w-100',
          loading && styles.loading,
          className,
        )}
        disabled={isDisabled}
        ref={ref}
        type={type}
        {...rest}
      >
        {loading ? (
          <>
            <span aria-hidden="true" className="spinner-border spinner-border-sm" />
            <span>{loadingText ?? children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
