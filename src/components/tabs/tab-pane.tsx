import clsx from 'clsx';
import { forwardRef, useEffect, useState } from 'react';

import type { TabPaneProps } from './types';

import { useTabs } from './tabs-context';
import { isSameKey } from './tabs-utils';

export const TabPane = forwardRef<HTMLElement, TabPaneProps>(
  (
    {
      active = false,
      as: Component = 'div',
      children,
      className,
      eventKey,
      role,
      transition,
      ...rest
    },
    ref,
  ) => {
    const tabs = useTabs();
    const isActive = tabs && eventKey != null ? isSameKey(tabs.activeEventKey, eventKey) : active;
    const fade = transition ?? tabs?.transition ?? false;
    const [shown, setShown] = useState(false);
    const [prevIsActive, setPrevIsActive] = useState(isActive);

    if (prevIsActive !== isActive) {
      setPrevIsActive(isActive);
      setShown(false);
    }

    useEffect(() => {
      if (!isActive || !fade || shown) {
        return;
      }
      let frame = 0;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          setShown(true);
        });
      });
      return () => cancelAnimationFrame(frame);
    }, [fade, isActive, shown]);

    const showClass = isActive && (!fade || shown);

    const paneId = tabs?.id && eventKey != null ? `${tabs.id}-tabpane-${eventKey}` : undefined;
    const controllerId = tabs?.id && eventKey != null ? `${tabs.id}-tab-${eventKey}` : undefined;

    return (
      <Component
        aria-labelledby={controllerId}
        className={clsx(
          'tab-pane',
          isActive && 'active',
          fade && 'fade',
          showClass && 'show',
          className,
        )}
        id={paneId}
        ref={ref}
        role={role ?? (tabs ? 'tabpanel' : undefined)}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

TabPane.displayName = 'TabPane';

export default TabPane;
