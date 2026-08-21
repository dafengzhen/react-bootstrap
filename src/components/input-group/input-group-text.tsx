import clsx from 'clsx';
import { forwardRef } from 'react';

import type { InputGroupTextProps } from './types';

export const InputGroupText = forwardRef<HTMLElement, InputGroupTextProps>(
  ({ as: Component = 'span', children, className, ...rest }, ref) => (
    <Component className={clsx('input-group-text', className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

InputGroupText.displayName = 'InputGroupText';

export default InputGroupText;
