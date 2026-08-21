import clsx from 'clsx';
import { forwardRef, useCallback } from 'react';

import type { FormCheckInputProps } from './types';

export const FormCheckInput = forwardRef<HTMLInputElement, FormCheckInputProps>(
  (
    {
      className,
      indeterminate = false,
      isInvalid = false,
      isValid = false,
      type = 'checkbox',
      ...rest
    },
    ref,
  ) => {
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
        ref={handleRef}
        type={type}
        {...rest}
      />
    );
  },
);

FormCheckInput.displayName = 'FormCheckInput';

export default FormCheckInput;
