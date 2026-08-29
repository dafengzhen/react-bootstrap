import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react';

import clsx from 'clsx';
import { forwardRef, useState } from 'react';

import type { AutoCompleteTokenProps } from './types';

import { preventInputBlur } from './auto-complete-utils';
import styles from './auto-complete.module.css';

export const AutoCompleteToken = forwardRef<HTMLDivElement, AutoCompleteTokenProps>(
  (
    {
      children,
      className,
      disabled = false,
      onBlur,
      onClick,
      onFocus,
      onKeyDown,
      onRemove,
      tabIndex = 0,
      ...rest
    },
    ref,
  ) => {
    const [active, setActive] = useState(false);
    const removeable = !disabled && onRemove !== undefined;

    const handleBlur = (event: FocusEvent<HTMLElement>) => {
      setActive(false);
      onBlur?.(event);
    };

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      setActive(true);
      onClick?.(event);
    };

    const handleFocus = (event: FocusEvent<HTMLElement>) => {
      setActive(true);
      onFocus?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Backspace' && active) {
        event.preventDefault();
        onRemove?.();
      }
      onKeyDown?.(event);
    };

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- token is focusable and removable via keyboard
      <div
        aria-disabled={disabled ? true : undefined}
        className={clsx(
          styles.token,
          removeable && styles.tokenRemoveable,
          active && styles.tokenActive,
          disabled && styles.tokenDisabled,
          className,
        )}
        data-auto-complete-token=""
        onBlur={handleBlur}
        onClick={handleClick}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        ref={ref}
        role={removeable ? 'button' : undefined}
        tabIndex={removeable ? tabIndex : undefined}
        {...rest}
      >
        <div className={styles.tokenLabel}>{children}</div>
        {removeable && (
          <button
            aria-label="Remove"
            className={clsx('btn-close', styles.tokenRemoveButton)}
            onClick={onRemove}
            onKeyDown={(event) => {
              if (event.key === 'Backspace') {
                event.preventDefault();
              }
            }}
            onMouseDown={preventInputBlur}
            tabIndex={-1}
            type="button"
          >
            <span aria-hidden="true" className={styles.closeContent}>
              ×
            </span>
            <span className="visually-hidden">Remove</span>
          </button>
        )}
      </div>
    );
  },
);

AutoCompleteToken.displayName = 'AutoCompleteToken';

export default AutoCompleteToken;
