import clsx from 'clsx';
import { forwardRef } from 'react';

import type { FormSelectProps } from './types';

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, htmlSize, isInvalid = false, isValid = false, size, ...rest }, ref) => (
    <select
      className={clsx(
        'form-select',
        size && `form-select-${size}`,
        isValid && 'is-valid',
        isInvalid && 'is-invalid',
        className,
      )}
      ref={ref}
      size={htmlSize}
      {...rest}
    />
  ),
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
