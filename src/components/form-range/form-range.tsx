import clsx from 'clsx';
import { forwardRef } from 'react';

import type { FormRangeProps } from './types';

export const FormRange = forwardRef<HTMLInputElement, FormRangeProps>(
  ({ className, isInvalid = false, isValid = false, ...rest }, ref) => (
    <input
      className={clsx('form-range', isValid && 'is-valid', isInvalid && 'is-invalid', className)}
      ref={ref}
      type="range"
      {...rest}
    />
  ),
);

FormRange.displayName = 'FormRange';

export default FormRange;
