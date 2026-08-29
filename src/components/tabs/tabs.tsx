import { Children, forwardRef, isValidElement } from 'react';

import type { TabProps, TabsProps } from './types';

import { Nav } from '../nav';
import { Tab } from './tab';
import { TabContainer } from './tab-container';
import { TabContent } from './tab-content';
import { TabPane } from './tab-pane';

export const Tabs = forwardRef<HTMLElement, TabsProps>(
  (
    {
      activeKey,
      children,
      className,
      contentClassName,
      defaultActiveKey,
      fill = false,
      id,
      justify = false,
      navClassName,
      onSelect,
      transition = false,
      variant = 'tabs',
      ...rest
    },
    ref,
  ) => {
    const childArray = Children.toArray(children);

    return (
      <TabContainer
        activeKey={activeKey}
        className={className}
        defaultActiveKey={defaultActiveKey}
        id={id}
        onSelect={onSelect}
        ref={ref}
        transition={transition}
        {...rest}
      >
        <Nav className={navClassName} fill={fill} justify={justify} variant={variant}>
          {childArray}
        </Nav>
        <TabContent className={contentClassName}>
          {childArray.map((child, index) => {
            if (!isValidElement<TabProps>(child) || child.type !== Tab) {
              return null;
            }
            return (
              <TabPane eventKey={child.props.eventKey} key={child.key ?? index}>
                {child.props.children}
              </TabPane>
            );
          })}
        </TabContent>
      </TabContainer>
    );
  },
);

Tabs.displayName = 'Tabs';

export default Tabs;
