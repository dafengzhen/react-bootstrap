import clsx from 'clsx';
import { forwardRef, useCallback } from 'react';

import type { FormCheckInputProps } from './types';

import { useFormContext } from '../../internal/form-context';

export const FormCheckInput = forwardRef<HTMLInputElement, FormCheckInputProps>(
  (
    {
      className,
      id,
      indeterminate = false,
      isInvalid = false,
      isValid = false,
      type = 'checkbox',
      ...rest
    },
    ref,
  ) => {
    const formContext = useFormContext();
    const handleRef = useCallback(
      (node: HTMLInputElement | null) => {
        if (node) {
          node.indeterminate = indeterminate;
        }
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [indeterminate, ref],
    );

    return (
      <input
        className={clsx(
          'form-check-input',
          isValid && 'is-valid',
          isInvalid && 'is-invalid',
          className,
        )}
        id={id ?? formContext?.controlId}
        ref={handleRef}
        type={type}
        {...rest}
      />
    );
  },
);

FormCheckInput.displayName = 'FormCheckInput';

export default FormCheckInput;
