import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TableSelectCellProps } from './types';

import { FormCheckInput } from '../form-check';

export const TableSelectCell = forwardRef<HTMLElement, TableSelectCellProps>(
  (
    {
      active = false,
      align,
      as: Component = 'td',
      checked,
      className,
      disabled = false,
      indeterminate = false,
      label,
      name,
      onChange,
      value,
      variant,
      ...rest
    },
    ref,
  ) => (
    <Component
      className={
        clsx(
          'table-select-cell',
          active && 'table-active',
          align && `align-${align}`,
          variant && `table-${variant}`,
          className,
        ) || undefined
      }
      ref={ref}
      {...rest}
    >
      <FormCheckInput
        aria-label={label}
        checked={checked}
        disabled={disabled}
        indeterminate={indeterminate}
        name={name}
        onChange={(event) => onChange?.(event.target.checked, event)}
        value={value}
      />
    </Component>
  ),
);

TableSelectCell.displayName = 'TableSelectCell';

export default TableSelectCell;
