import clsx from 'clsx';
import { forwardRef } from 'react';

import type { FormCheckLabelProps } from './types';

export const FormCheckLabel = forwardRef<HTMLLabelElement, FormCheckLabelProps>(
  ({ className, htmlFor, ...rest }, ref) => (
    <label className={clsx('form-check-label', className)} htmlFor={htmlFor} ref={ref} {...rest} />
  ),
);

FormCheckLabel.displayName = 'FormCheckLabel';

export default FormCheckLabel;
