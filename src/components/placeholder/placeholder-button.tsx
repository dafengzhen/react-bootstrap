import { type ForwardedRef, forwardRef } from 'react';

import type { PlaceholderButtonProps } from './types';

import { Button } from '../button';
import { resolvePlaceholderClassName } from './placeholder-utils';

export const PlaceholderButton = forwardRef<HTMLButtonElement, PlaceholderButtonProps>(
  ({ animation, bg, children, className, size, variant, xs, ...rest }, ref) => (
    <Button
      className={resolvePlaceholderClassName(className, animation, bg, size, xs)}
      disabled
      ref={ref as unknown as ForwardedRef<HTMLElement>}
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
