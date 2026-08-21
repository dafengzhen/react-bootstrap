import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TableCaptionProps } from './types';

export const TableCaption = forwardRef<HTMLElement, TableCaptionProps>(
  ({ as: Component = 'caption', captionTop = false, children, className, ...rest }, ref) => (
    <Component
      className={clsx(captionTop && 'caption-top', className) || undefined}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

TableCaption.displayName = 'TableCaption';

export default TableCaption;
