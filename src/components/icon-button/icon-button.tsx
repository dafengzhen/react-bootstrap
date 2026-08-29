import clsx from 'clsx';
import { forwardRef, type MouseEvent, useState } from 'react';

import type { IconButtonProps } from './types';

import styles from './icon-button.module.css';

export const IconButton = forwardRef<HTMLElement, IconButtonProps>(
  (
    {
      active,
      'aria-label': ariaLabel,
      as: Component = 'button',
      children,
      className,
      defaultActive = false,
      disabled = false,
      href,
      label,
      loading = false,
      onClick,
      shape = 'rounded',
      size,
      title,
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

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }

      if (toggle && active === undefined) {
        setPressed((prev) => !prev);
      }
      onClick?.(event);
    };

    return (
      <Tag
        aria-busy={loading || undefined}
        aria-disabled={isDisabled && !canBeDisabled ? true : undefined}
        aria-label={ariaLabel ?? label}
        aria-pressed={toggle && !isDisabled ? (isActive ?? false) : undefined}
        className={clsx(
          'btn',
          styles.icon,
          variant && `btn-${variant}`,
          size && `btn-${size}`,
          shape === 'circle' && 'rounded-circle',
          shape === 'square' && 'rounded-0',
          isActive && 'active',
          isDisabled && !canBeDisabled && 'disabled',
          loading && styles.loading,
          className,
        )}
        disabled={isDisabled && canBeDisabled ? true : undefined}
        href={Tag === 'a' && href !== undefined ? href : undefined}
        onClick={handleClick}
        ref={ref}
        tabIndex={isDisabled && Tag === 'a' ? -1 : undefined}
        title={title ?? label}
        type={canBeDisabled ? type : undefined}
        {...rest}
      >
        {Tag === 'input' ? null : loading ? (
          <span aria-hidden="true" className="spinner-border spinner-border-sm" />
        ) : (
          children
        )}
      </Tag>
    );
  },
);

IconButton.displayName = 'IconButton';

export default IconButton;
