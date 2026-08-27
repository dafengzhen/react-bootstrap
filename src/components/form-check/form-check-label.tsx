import clsx from 'clsx';
import { forwardRef } from 'react';

import type { FormCheckLabelProps } from './types';

import { useFormContext } from '../../internal/form-context';

export const FormCheckLabel = forwardRef<HTMLLabelElement, FormCheckLabelProps>(
  ({ className, htmlFor, ...rest }, ref) => {
    const formContext = useFormContext();

    return (
      <label
        className={clsx('form-check-label', className)}
        htmlFor={htmlFor ?? formContext?.controlId}
        ref={ref}
        {...rest}
      />
    );
  },
);

FormCheckLabel.displayName = 'FormCheckLabel';

export default FormCheckLabel;
