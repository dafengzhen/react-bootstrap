import clsx from 'clsx';
import { forwardRef } from 'react';

import type { FormProps } from './types';

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className, validated = false, ...rest }, ref) => (
    <form className={clsx(validated && 'was-validated', className)} ref={ref} {...rest} />
  ),
);

Form.displayName = 'Form';

export default Form;
