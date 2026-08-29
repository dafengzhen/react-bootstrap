import clsx from 'clsx';
import { forwardRef } from 'react';

import type { FormControlElement, FormControlProps } from './types';

import { useFormContext } from '../../contexts';

export const FormControl = forwardRef<FormControlElement, FormControlProps>(
  (
    {
      as: Component = 'input',
      className,
      htmlSize,
      id,
      isInvalid = false,
      isValid = false,
      plaintext = false,
      size,
      type,
      ...rest
    },
    ref,
  ) => {
    const formContext = useFormContext();

    return (
      <Component
        className={clsx(
          plaintext ? 'form-control-plaintext' : 'form-control',
          size && `form-control-${size}`,
          type === 'color' && 'form-control-color',
          isValid && 'is-valid',
          isInvalid && 'is-invalid',
          className,
        )}
        id={id ?? formContext?.controlId}
        ref={ref}
        size={htmlSize}
        type={type}
        {...rest}
      />
    );
  },
);

FormControl.displayName = 'FormControl';

export default FormControl;
