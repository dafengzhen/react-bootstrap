import clsx from 'clsx';
import { forwardRef } from 'react';

import type { AccordionHeaderProps } from './types';

import { AccordionButton } from './accordion-button';

export const AccordionHeader = forwardRef<HTMLElement, AccordionHeaderProps>(
  ({ as: Component = 'h2', children, className, onClick, ...rest }, ref) => (
    <Component className={clsx('accordion-header', className)} ref={ref} {...rest}>
      <AccordionButton onClick={onClick}>{children}</AccordionButton>
    </Component>
  ),
);

AccordionHeader.displayName = 'AccordionHeader';

export default AccordionHeader;
