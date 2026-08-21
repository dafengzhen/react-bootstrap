import clsx from 'clsx';
import { forwardRef } from 'react';

import type { InputGroupRadioProps } from './types';

import { FormCheckInput } from '../form-check';
import { InputGroupText } from './input-group-text';

export const InputGroupRadio = forwardRef<HTMLInputElement, InputGroupRadioProps>(
  ({ className, ...rest }, ref) => (
    <InputGroupText>
      <FormCheckInput className={clsx('mt-0', className)} ref={ref} type="radio" {...rest} />
    </InputGroupText>
  ),
);

InputGroupRadio.displayName = 'InputGroupRadio';

export default InputGroupRadio;
