import clsx from 'clsx';
import { forwardRef } from 'react';

import type { BlockquoteFooterProps } from './types';

export const BlockquoteFooter = forwardRef<HTMLElement, BlockquoteFooterProps>(
  ({ as: Component = 'figcaption', children, className, source, sourceTitle, ...rest }, ref) => (
    <Component className={clsx('blockquote-footer', className)} ref={ref} {...rest}>
      {children}
      {source != null && <cite title={sourceTitle}>{source}</cite>}
    </Component>
  ),
);

BlockquoteFooter.displayName = 'BlockquoteFooter';

export default BlockquoteFooter;
