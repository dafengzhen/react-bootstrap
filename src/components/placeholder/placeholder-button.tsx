import clsx from 'clsx';
import { forwardRef } from 'react';

import type { PlaceholderButtonProps } from './types';

import { Button } from '../button';

export const PlaceholderButton = forwardRef<HTMLButtonElement, PlaceholderButtonProps>(
  ({ animation, bg, children, className, size, variant, xs, ...rest }, ref) => (
    <Button
      className={clsx(
        animation ? `placeholder-${animation}` : 'placeholder',
        bg && `bg-${bg}`,
        size && `placeholder-${size}`,
        xs === 'auto' ? 'col-auto' : typeof xs === 'number' ? `col-${xs}` : xs && 'col',
        className,
      )}
      disabled
      ref={ref}
      tabIndex={-1}
      variant={variant}
      {...rest}
    >
      {children}
    </Button>
  ),
);

PlaceholderButton.displayName = 'PlaceholderButton';

export default PlaceholderButton;
