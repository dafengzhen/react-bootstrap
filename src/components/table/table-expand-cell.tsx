import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TableExpandCellProps } from './types';

export const TableExpandCell = forwardRef<HTMLElement, TableExpandCellProps>(
  (
    {
      active = false,
      align,
      as: Component = 'td',
      className,
      collapseLabel = 'Collapse',
      disabled = false,
      expanded = false,
      expandLabel = 'Expand',
      onToggle,
      variant,
      ...rest
    },
    ref,
  ) => (
    <Component
      className={
        clsx(
          'table-expand-cell',
          active && 'table-active',
          align && `align-${align}`,
          variant && `table-${variant}`,
          className,
        ) || undefined
      }
      ref={ref}
      {...rest}
    >
      <button
        aria-expanded={expanded}
        aria-label={expanded ? collapseLabel : expandLabel}
        className="btn btn-link btn-sm p-0 table-expand-toggle"
        disabled={disabled}
        onClick={(event) => onToggle?.(!expanded, event)}
        type="button"
      >
        {expanded ? '▾' : '▸'}
      </button>
    </Component>
  ),
);

TableExpandCell.displayName = 'TableExpandCell';

export default TableExpandCell;
