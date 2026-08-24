import clsx from 'clsx';
import { forwardRef, useId, useMemo } from 'react';

import type { AccordionItemContextValue, AccordionItemProps } from './types';

import { AccordionItemContext } from './accordion-context';

export const AccordionItem = forwardRef<HTMLElement, AccordionItemProps>(
  ({ as: Component = 'div', children, className, eventKey: eventKeyProp, ...rest }, ref) => {
    const generatedKey = useId();
    const eventKey = eventKeyProp ?? generatedKey;

    const contextValue = useMemo<AccordionItemContextValue>(() => ({ eventKey }), [eventKey]);

    return (
      <AccordionItemContext.Provider value={contextValue}>
        <Component className={clsx('accordion-item', className)} ref={ref} {...rest}>
          {children}
        </Component>
      </AccordionItemContext.Provider>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';

export default AccordionItem;
