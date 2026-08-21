import clsx from 'clsx';
import { forwardRef } from 'react';

import type { FormCheckProps } from './types';

export const FormCheck = forwardRef<HTMLDivElement, FormCheckProps>(
  ({ className, inline = false, reverse = false, type, ...rest }, ref) => (
    <div
      className={clsx(
        'form-check',
        type === 'switch' && 'form-switch',
        inline && 'form-check-inline',
        reverse && 'form-check-reverse',
        className,
      )}
      ref={ref}
      {...rest}
    />
  ),
);

FormCheck.displayName = 'FormCheck';

export default FormCheck;
