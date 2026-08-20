import { forwardRef } from 'react';

import type { SplitButtonProps } from './types';

import { Button } from '../button';
import { ButtonGroup } from '../button-group';
import { Dropdown } from './dropdown';
import { DropdownMenu } from './dropdown-menu';
import { DropdownToggle } from './dropdown-toggle';

export const SplitButton = forwardRef<HTMLElement, SplitButtonProps>(
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
      href,
      id,
      menuVariant,
      onClick,
      onSelect,
      onToggle,
      popperConfig,
      renderMenuOnMount,
      show,
      size,
      title,
      toggleClassName,
      toggleLabel,
      type = 'button',
      variant,
      ...rest
    },
    ref,
  ) => (
    <Dropdown
      align={align}
      as={ButtonGroup}
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
      <Button
        disabled={disabled}
        href={href}
        onClick={onClick}
        size={size}
        type={type}
        variant={variant}
      >
        {title}
      </Button>
      <DropdownToggle
        className={toggleClassName}
        disabled={disabled}
        id={id}
        size={size}
        split
        toggleLabel={toggleLabel}
        variant={variant}
      />
      <DropdownMenu variant={menuVariant}>{children}</DropdownMenu>
    </Dropdown>
  ),
);

SplitButton.displayName = 'SplitButton';

export default SplitButton;
