import { type MouseEvent, useCallback } from 'react';

import type { AccordionButtonHandleProps, AccordionEventKey } from './types';

import { useAccordion, useAccordionItem } from './accordion-context';
import { isSameEventKey } from './accordion-utils';

export const useAccordionButton = (
  eventKey?: AccordionEventKey,
  onClick?: (event: MouseEvent<HTMLElement>) => void,
): AccordionButtonHandleProps => {
  const accordion = useAccordion();
  const item = useAccordionItem();

  const key = eventKey ?? item?.eventKey ?? null;
  const isActive =
    accordion !== null &&
    key != null &&
    accordion.activeKeys.some((activeKey) => isSameEventKey(activeKey, key));

  const collapseId = accordion?.id && key != null ? `${accordion.id}-collapse-${key}` : undefined;
  const buttonId = accordion?.id && key != null ? `${accordion.id}-heading-${key}` : undefined;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      if (key != null && accordion !== null) {
        accordion.onSelect(key, event);
      }
    },
    [accordion, key, onClick],
  );

  return {
    'aria-controls': collapseId,
    'aria-expanded': isActive,
    id: buttonId,
    onClick: handleClick,
  };
};
