import type { CSSProperties } from 'react';

import clsx from 'clsx';
import { Children, forwardRef } from 'react';

import type { AutoCompleteMenuProps } from './types';

import { DEFAULT_EMPTY_LABEL, DEFAULT_MAX_HEIGHT, preventInputBlur } from './auto-complete-utils';
import styles from './auto-complete.module.css';

export const AutoCompleteMenu = forwardRef<HTMLElement, AutoCompleteMenuProps>(
  (
    {
      as: Component = 'div',
      children,
      className,
      emptyLabel = DEFAULT_EMPTY_LABEL,
      id,
      maxHeight = DEFAULT_MAX_HEIGHT,
      style,
      ...rest
    },
    ref,
  ) => {
    const hasChildren = Children.count(children) > 0;
    const mergedStyle: CSSProperties = { display: 'block', maxHeight, overflow: 'auto', ...style };

    return (
      <Component
        aria-label="menu-options"
        className={clsx(styles.menu, 'dropdown-menu', 'show', className)}
        id={id}
        onMouseDown={preventInputBlur}
        ref={ref}
        // eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- combobox popup uses the listbox role
        role="listbox"
        style={mergedStyle}
        {...rest}
      >
        {hasChildren ? (
          children
        ) : (
          <button
            aria-disabled="true"
            aria-selected="false"
            className="dropdown-item disabled"
            // eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- combobox popup options use the option role
            role="option"
            tabIndex={-1}
            type="button"
          >
            {emptyLabel}
          </button>
        )}
      </Component>
    );
  },
);

AutoCompleteMenu.displayName = 'AutoCompleteMenu';

export default AutoCompleteMenu;
