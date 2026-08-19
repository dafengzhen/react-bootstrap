import { forwardRef } from 'react';

import type { TabProps } from './types';

import { NavItem } from './nav-item';
import { NavLink } from './nav-link';

export const Tab = forwardRef<HTMLElement, TabProps>(
  (
    { children: _children, className, disabled = false, eventKey, tabClassName, title, ...rest },
    ref,
  ) => (
    <NavItem className={className} ref={ref}>
      <NavLink
        className={tabClassName}
        disabled={disabled}
        eventKey={eventKey}
        type="button"
        {...rest}
      >
        {title}
      </NavLink>
    </NavItem>
  ),
);

Tab.displayName = 'Tab';

export default Tab;
