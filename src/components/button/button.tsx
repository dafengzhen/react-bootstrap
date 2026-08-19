import clsx from 'clsx';
import { forwardRef, type MouseEvent, useState } from 'react';

import type { ButtonProps } from './types';

import styles from './button.module.css';

export const Button = forwardRef<HTMLElement, ButtonProps>(
  (
    {
      active,
      as: Component = 'button',
      block = false,
      children,
      className,
      defaultActive = false,
      disabled = false,
      href,
      loading = false,
      loadingText,
      onClick,
      size,
      toggle = false,
      type = 'button',
      variant,
      ...rest
    },
    ref,
  ) => {
    const [pressed, setPressed] = useState(defaultActive);

    const Tag = href !== undefined && Component === 'button' ? 'a' : Component;
    const canBeDisabled = Tag === 'button' || Tag === 'input';
    const isActive = active ?? (toggle && pressed);
    const isDisabled = disabled || loading;
    const isInput = Tag === 'input';
    const isLink = Tag === 'a';

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (toggle && active === undefined && !isDisabled) {
        setPressed((prev) => !prev);
      }
      onClick?.(event);
    };

    return (
      <Tag
        aria-busy={loading || undefined}
        aria-disabled={isDisabled && !canBeDisabled ? true : undefined}
        aria-pressed={toggle && !isDisabled ? (isActive ?? false) : undefined}
        className={clsx(
          'btn',
          variant && `btn-${variant}`,
          size && `btn-${size}`,
          isActive && 'active',
          block && 'w-100',
          isDisabled && !canBeDisabled && 'disabled',
          loading && styles.loading,
          className,
        )}
        disabled={isDisabled && canBeDisabled ? true : undefined}
        href={isLink && href !== undefined ? href : undefined}
        onClick={handleClick}
        ref={ref}
        tabIndex={isDisabled && isLink ? -1 : undefined}
        type={canBeDisabled ? type : undefined}
        {...rest}
      >
        {isInput ? null : loading ? (
          <>
            <span aria-hidden="true" className="spinner-border spinner-border-sm" />
            <span>{loadingText ?? children}</span>
          </>
        ) : (
          children
        )}
      </Tag>
    );
  },
);

Button.displayName = 'Button';

export default Button;
