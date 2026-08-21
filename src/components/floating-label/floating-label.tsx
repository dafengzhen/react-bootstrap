import clsx from 'clsx';
import { forwardRef } from 'react';

import type { FloatingLabelProps } from './types';

export const FloatingLabel = forwardRef<HTMLElement, FloatingLabelProps>(
  ({ as: Component = 'div', children, className, controlId, label, ...rest }, ref) => (
    <Component className={clsx('form-floating', className)} ref={ref} {...rest}>
      {children}
      <label htmlFor={controlId}>{label}</label>
    </Component>
  ),
);

FloatingLabel.displayName = 'FloatingLabel';

export default FloatingLabel;
