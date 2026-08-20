import { forwardRef } from 'react';

import type { DropdownButtonProps } from './types';

import { Dropdown } from './dropdown';
import { DropdownMenu } from './dropdown-menu';
import { DropdownToggle } from './dropdown-toggle';

export const DropdownButton = forwardRef<HTMLElement, DropdownButtonProps>(
  (
    {
      align,
      autoClose,
      children,
      className,
      defaultShow,
      disabled = false,
      drop,
      flip,
      focusFirstItemOnShow,
      id,
      menuVariant,
      onSelect,
      onToggle,
      popperConfig,
      renderMenuOnMount,
      show,
      size,
      title,
      toggleClassName,
      type,
      variant,
      ...rest
    },
    ref,
  ) => (
    <Dropdown
      align={align}
      autoClose={autoClose}
      className={className}
      defaultShow={defaultShow}
      drop={drop}
      flip={flip}
      focusFirstItemOnShow={focusFirstItemOnShow}
      onSelect={onSelect}
      onToggle={onToggle}
      popperConfig={popperConfig}
      ref={ref}
      renderMenuOnMount={renderMenuOnMount}
      show={show}
      {...rest}
    >
      <DropdownToggle
        className={toggleClassName}
        disabled={disabled}
        id={id}
        size={size}
        type={type}
        variant={variant}
      >
        {title}
      </DropdownToggle>
      <DropdownMenu variant={menuVariant}>{children}</DropdownMenu>
    </Dropdown>
  ),
);

DropdownButton.displayName = 'DropdownButton';

export default DropdownButton;
