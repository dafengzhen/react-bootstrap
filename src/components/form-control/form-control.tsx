import clsx from 'clsx';
import { forwardRef } from 'react';

import type { FormControlElement, FormControlProps } from './types';

export const FormControl = forwardRef<FormControlElement, FormControlProps>(
  (
    {
      as: Component = 'input',
      className,
      htmlSize,
      isInvalid = false,
      isValid = false,
      plaintext = false,
      size,
      type,
      ...rest
    },
    ref,
  ) => (
    <Component
      className={clsx(
        plaintext ? 'form-control-plaintext' : 'form-control',
        size && `form-control-${size}`,
        type === 'color' && 'form-control-color',
        isValid && 'is-valid',
        isInvalid && 'is-invalid',
        className,
      )}
      ref={ref}
      size={htmlSize}
      type={type}
      {...rest}
    />
  ),
);

FormControl.displayName = 'FormControl';

export default FormControl;
