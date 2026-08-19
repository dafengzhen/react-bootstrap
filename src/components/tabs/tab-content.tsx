import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TabContentProps } from './types';

export const TabContent = forwardRef<HTMLElement, TabContentProps>(
  ({ as: Component = 'div', children, className, ...rest }, ref) => (
    <Component className={clsx('tab-content', className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

TabContent.displayName = 'TabContent';

export default TabContent;
