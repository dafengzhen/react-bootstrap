import clsx from 'clsx';
import { forwardRef } from 'react';

import type { BlockquoteProps } from './types';

export const Blockquote = forwardRef<HTMLElement, BlockquoteProps>(
  ({ as: Component = 'blockquote', children, className, ...rest }, ref) => (
    <Component className={clsx('blockquote', className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

Blockquote.displayName = 'Blockquote';

export default Blockquote;
