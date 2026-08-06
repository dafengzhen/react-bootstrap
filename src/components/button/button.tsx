import clsx from 'clsx';

import type { ButtonProps } from './button.types';

import styles from './button.module.css';

export function Button({
  children,

  className,

  disabled,

  loading = false,

  outline = false,

  variant = 'primary',

  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'btn',

        outline ? `btn-outline-${variant}` : `btn-${variant}`,

        loading && styles.loading,

        className,
      )}

      disabled={disabled || loading}

      {...props}
    >
      {loading && <span className="spinner-border spinner-border-sm me-2" />}

      {children}
    </button>
  );
}
