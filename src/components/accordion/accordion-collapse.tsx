import clsx from 'clsx';
import { forwardRef, useCallback, useState } from 'react';

import type { AccordionCollapseProps } from './types';

import { Collapse } from '../collapse';
import { useAccordion, useAccordionItem } from './accordion-context';
import { isSameEventKey } from './accordion-utils';

export const AccordionCollapse = forwardRef<HTMLDivElement, AccordionCollapseProps>(
  ({ children, className, eventKey: eventKeyProp, onEnter, onExited, ...rest }, ref) => {
    const accordion = useAccordion();
    const item = useAccordionItem();

    const eventKey = eventKeyProp ?? item?.eventKey ?? null;
    const isActive =
      accordion !== null &&
      eventKey != null &&
      accordion.activeKeys.some((activeKey) => isSameEventKey(activeKey, eventKey));

    const [show, setShow] = useState(isActive);

    const collapseId =
      accordion?.id && eventKey != null ? `${accordion.id}-collapse-${eventKey}` : undefined;

    const handleEnter = useCallback(() => {
      setShow(true);
      onEnter?.();
    }, [onEnter]);

    const handleExited = useCallback(() => {
      setShow(false);
      onExited?.();
    }, [onExited]);

    return (
      <Collapse
        className={clsx('accordion-collapse', show && 'show', className)}
        id={collapseId}
        in={isActive}
        onEnter={handleEnter}
        onExited={handleExited}
        ref={ref}
        {...rest}
      >
        {children}
      </Collapse>
    );
  },
);

AccordionCollapse.displayName = 'AccordionCollapse';

export default AccordionCollapse;
