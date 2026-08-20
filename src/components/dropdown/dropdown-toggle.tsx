import clsx from 'clsx';
import { forwardRef, type MouseEvent } from 'react';

import type { DropdownToggleProps } from './types';

import { Button } from '../button';
import { useDropdown } from './context';

const DEFAULT_TOGGLE_LABEL = 'Toggle dropdown';

export const DropdownToggle = forwardRef<HTMLElement, DropdownToggleProps>(
  (
    {
      as,
      children,
      className,
      disabled = false,
      id,
      onClick,
      size,
      split = false,
      toggleLabel = DEFAULT_TOGGLE_LABEL,
      type = 'button',
      variant,
      ...rest
    },
    ref,
  ) => {
    const dropdown = useDropdown();
    const show = dropdown?.show ?? false;

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (disabled) {
        return;
      }
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      const source = event.detail === 0 ? 'keydown' : 'click';
      dropdown?.toggle(!show, event, source);
    };

    const setRefs = (element: HTMLElement | null) => {
      dropdown?.setToggle(element, id);
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <Button
        aria-expanded={show}
        aria-haspopup="menu"
        as={as}
        className={clsx('dropdown-toggle', split && 'dropdown-toggle-split', className)}
        disabled={disabled}
        id={id}
        onClick={handleClick}
        ref={setRefs}
        size={size}
        type={type}
        variant={variant}
        {...rest}
      >
        {split ? (children ?? <span className="visually-hidden">{toggleLabel}</span>) : children}
      </Button>
    );
  },
);

DropdownToggle.displayName = 'DropdownToggle';

export default DropdownToggle;
