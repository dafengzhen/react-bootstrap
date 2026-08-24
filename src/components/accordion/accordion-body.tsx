import clsx from 'clsx';
import { forwardRef } from 'react';

import type { AccordionBodyProps } from './types';

import { AccordionCollapse } from './accordion-collapse';
import { useAccordionItem } from './accordion-context';

export const AccordionBody = forwardRef<HTMLElement, AccordionBodyProps>(
  ({ as: Component = 'div', children, className, ...rest }, ref) => {
    const item = useAccordionItem();

    return (
      <AccordionCollapse eventKey={item?.eventKey} {...rest}>
        <Component className={clsx('accordion-body', className)} ref={ref}>
          {children}
        </Component>
      </AccordionCollapse>
    );
  },
);

AccordionBody.displayName = 'AccordionBody';

export default AccordionBody;
