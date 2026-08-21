import clsx from 'clsx';
import { forwardRef } from 'react';

import type { InputGroupProps } from './types';

export const InputGroup = forwardRef<HTMLElement, InputGroupProps>(
  ({ as: Component = 'div', children, className, hasValidation = false, size, ...rest }, ref) => (
    <Component
      className={clsx(
        'input-group',
        size && `input-group-${size}`,
        hasValidation && 'has-validation',
        className,
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);

InputGroup.displayName = 'InputGroup';

export default InputGroup;
