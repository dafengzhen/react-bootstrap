import clsx from 'clsx';
import { forwardRef } from 'react';

import type { FormLabelProps } from './types';

import { getColClasses } from './layout-utils';

export const FormLabel = forwardRef<HTMLElement, FormLabelProps>(
  (
    {
      as: Component = 'label',
      children,
      className,
      column = false,
      htmlFor,
      lg,
      md,
      sm,
      visuallyHidden = false,
      xl,
      xs,
      xxl,
      ...rest
    },
    ref,
  ) => (
    <Component
      className={clsx(
        column ? 'col-form-label' : 'form-label',
        typeof column === 'string' && `col-form-label-${column}`,
        visuallyHidden && 'visually-hidden',
        column && clsx(...getColClasses({ lg, md, sm, xl, xs, xxl })),
        className,
      )}
      htmlFor={htmlFor}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

FormLabel.displayName = 'FormLabel';

export default FormLabel;
