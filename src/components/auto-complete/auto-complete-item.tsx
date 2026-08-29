import type { MouseEvent as ReactMouseEvent } from 'react';

import clsx from 'clsx';
import { forwardRef } from 'react';

import type { AutoCompleteItemProps } from './types';

import { useAutoComplete } from './auto-complete-context';
import { AutoCompleteHighlighter } from './auto-complete-highlighter';
import {
  getMenuItemId,
  getOptionDisabled,
  getOptionLabel,
  preventInputBlur,
} from './auto-complete-utils';
import styles from './auto-complete.module.css';

export const AutoCompleteItem = forwardRef<HTMLElement, AutoCompleteItemProps>(
  (
    {
      active: activeProp,
      as: Component = 'a',
      children,
      className,
      disabled: disabledProp,
      href,
      labelKey,
      onClick,
      onMouseEnter,
      onSelect,
      option,
      position,
      ...rest
    },
    ref,
  ) => {
    const context = useAutoComplete();
    const isAnchor = Component === 'a';
    const active = activeProp ?? position === context.activeIndex;
    const disabled = disabledProp ?? getOptionDisabled(option);

    const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
      onClick?.(event);
      if (disabled || event.defaultPrevented) {
        event.preventDefault();
        return;
      }
      onSelect?.(option, event);
      if (event.defaultPrevented) {
        event.preventDefault();
        return;
      }
      context.onItemClick(option);
      // Prevent the anchor's default navigation (href="#") after successful selection.
      event.preventDefault();
    };

    const handleMouseEnter = (event: ReactMouseEvent<HTMLElement>) => {
      onMouseEnter?.(event);
      if (!disabled) {
        context.onActiveIndexChange(position);
      }
    };

    return (
      <Component
        aria-disabled={disabled ? true : undefined}
        aria-selected={active ? 'true' : undefined}
        className={clsx(
          'dropdown-item',
          styles.menuItem,
          active && 'active',
          disabled && 'disabled',
          className,
        )}
        href={isAnchor ? (href ?? '#') : undefined}
        id={getMenuItemId(context.id, position)}
        onClick={handleClick}
        onMouseDown={preventInputBlur}
        onMouseEnter={handleMouseEnter}
        ref={ref}
        // eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- combobox popup options use the option role
        role="option"
        {...rest}
      >
        {children ?? (
          <AutoCompleteHighlighter search={context.text}>
            {getOptionLabel(option, labelKey ?? context.labelKey)}
          </AutoCompleteHighlighter>
        )}
      </Component>
    );
  },
);

AutoCompleteItem.displayName = 'AutoCompleteItem';

export default AutoCompleteItem;
