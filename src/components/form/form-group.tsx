import { forwardRef, useMemo } from 'react';

import type { FormGroupProps } from './types';

import { FormContext } from '../../contexts';

export const FormGroup = forwardRef<HTMLElement, FormGroupProps>(
  ({ as: Component = 'div', children, className, controlId, ...rest }, ref) => {
    const contextValue = useMemo(() => ({ controlId }), [controlId]);

    return (
      <FormContext.Provider value={contextValue}>
        <Component className={className} ref={ref} {...rest}>
          {children}
        </Component>
      </FormContext.Provider>
    );
  },
);

FormGroup.displayName = 'FormGroup';

export default FormGroup;
