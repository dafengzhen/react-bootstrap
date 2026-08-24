import clsx from 'clsx';
import { forwardRef, useCallback, useId, useMemo, useState } from 'react';

import type { AccordionEventKey, AccordionProps, AccordionSelectCallback } from './types';

import { AccordionContext } from './accordion-context';
import { isSameEventKey, toEventKeyArray } from './accordion-utils';

export const Accordion = forwardRef<HTMLElement, AccordionProps>(
  (
    {
      activeKey,
      alwaysOpen = false,
      as: Component = 'div',
      children,
      className,
      defaultActiveKey,
      flush = false,
      id,
      onSelect,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const [internalKeys, setInternalKeys] = useState<AccordionEventKey[]>(() =>
      toEventKeyArray(defaultActiveKey),
    );

    const activeKeys = activeKey == null ? internalKeys : toEventKeyArray(activeKey);

    const handleSelect = useCallback<AccordionSelectCallback>(
      (eventKey, event) => {
        onSelect?.(eventKey, event);
        if (activeKey != null || eventKey == null) {
          return;
        }
        setInternalKeys((previous) => {
          const wasActive = previous.some((key) => isSameEventKey(key, eventKey));
          if (wasActive) {
            return previous.filter((key) => !isSameEventKey(key, eventKey));
          }
          return alwaysOpen ? [...previous, eventKey] : [eventKey];
        });
      },
      [activeKey, alwaysOpen, onSelect],
    );

    const contextValue = useMemo(
      () => ({ activeKeys, alwaysOpen, id: id ?? generatedId, onSelect: handleSelect }),
      [activeKeys, alwaysOpen, generatedId, handleSelect, id],
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <Component
          className={clsx('accordion', flush && 'accordion-flush', className)}
          id={id}
          ref={ref}
          {...rest}
        >
          {children}
        </Component>
      </AccordionContext.Provider>
    );
  },
);

Accordion.displayName = 'Accordion';

export default Accordion;
