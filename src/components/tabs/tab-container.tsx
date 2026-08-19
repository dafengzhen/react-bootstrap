import { forwardRef, type SyntheticEvent, useCallback, useMemo, useState } from 'react';

import type { EventKey, TabContainerProps, TabsContextValue } from './types';

import { TabsContext } from './context';

export const TabContainer = forwardRef<HTMLElement, TabContainerProps>(
  (
    {
      activeKey,
      as: Component = 'div',
      children,
      className,
      defaultActiveKey,
      id,
      onSelect,
      transition = false,
      ...rest
    },
    ref,
  ) => {
    const [internalKey, setInternalKey] = useState<EventKey | undefined>(defaultActiveKey);

    const currentKey = activeKey != null ? activeKey : internalKey;

    const handleSelect = useCallback(
      (eventKey: EventKey, event: SyntheticEvent) => {
        if (eventKey == null) {
          return;
        }
        onSelect?.(eventKey, event);
        if (activeKey == null) {
          setInternalKey(eventKey);
        }
      },
      [activeKey, onSelect],
    );

    const contextValue = useMemo<TabsContextValue>(
      () => ({ activeEventKey: currentKey, id, onSelect: handleSelect, transition }),
      [currentKey, handleSelect, id, transition],
    );

    return (
      <TabsContext.Provider value={contextValue}>
        <Component className={className} ref={ref} {...rest}>
          {children}
        </Component>
      </TabsContext.Provider>
    );
  },
);

TabContainer.displayName = 'TabContainer';

export default TabContainer;
