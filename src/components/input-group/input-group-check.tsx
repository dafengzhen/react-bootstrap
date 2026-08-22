import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';

import { FormCheckInput } from '../form-check';
import { InputGroupText } from './input-group-text';

interface InputGroupCheckProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
}

export const createInputGroupCheck = <P extends InputGroupCheckProps>(type: 'checkbox' | 'radio') =>
  forwardRef<HTMLInputElement, P>(({ className, ...rest }, ref) => (
    <InputGroupText>
      <FormCheckInput className={clsx('mt-0', className)} ref={ref} type={type} {...rest} />
    </InputGroupText>
  ));
