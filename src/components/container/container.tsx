import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ContainerProps } from './types';

export const Container = forwardRef<HTMLElement, ContainerProps>(
  ({ as: Component = 'div', className, fluid = false, ...rest }, ref) => (
    <Component
      className={clsx(
        fluid === true ? 'container-fluid' : fluid ? `container-${fluid}` : 'container',
        className,
      )}
      ref={ref}
      {...rest}
    />
  ),
);

Container.displayName = 'Container';

export default Container;
