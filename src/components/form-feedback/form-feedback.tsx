import clsx from 'clsx';
import { forwardRef } from 'react';

import type { FormFeedbackProps } from './types';

export const FormFeedback = forwardRef<HTMLElement, FormFeedbackProps>(
  ({ as: Component = 'div', className, tooltip = false, type = 'valid', ...rest }, ref) => (
    <Component
      className={clsx(`${type}-${tooltip ? 'tooltip' : 'feedback'}`, className)}
      ref={ref}
      {...rest}
    />
  ),
);

FormFeedback.displayName = 'FormFeedback';

export default FormFeedback;
