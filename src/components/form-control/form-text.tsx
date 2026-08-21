import clsx from 'clsx';
import { forwardRef } from 'react';

import type { FormTextProps } from './types';

export const FormText = forwardRef<HTMLElement, FormTextProps>(
  ({ as: Component = 'small', children, className, muted = false, ...rest }, ref) => (
    <Component className={clsx('form-text', muted && 'text-muted', className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

FormText.displayName = 'FormText';

export default FormText;
