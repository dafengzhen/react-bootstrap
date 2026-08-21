import clsx from 'clsx';
import { forwardRef } from 'react';

import type { InputGroupCheckboxProps } from './types';

import { FormCheckInput } from '../form-check';
import { InputGroupText } from './input-group-text';

export const InputGroupCheckbox = forwardRef<HTMLInputElement, InputGroupCheckboxProps>(
  ({ className, ...rest }, ref) => (
    <InputGroupText>
      <FormCheckInput className={clsx('mt-0', className)} ref={ref} type="checkbox" {...rest} />
    </InputGroupText>
  ),
);

InputGroupCheckbox.displayName = 'InputGroupCheckbox';

export default InputGroupCheckbox;
