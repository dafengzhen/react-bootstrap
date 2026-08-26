import clsx from 'clsx';
import { Children, cloneElement, forwardRef, isValidElement, useMemo } from 'react';

import type { TimelineContextValue, TimelineItemProps, TimelineProps } from './types';

import { TimelineContext } from './timeline-context';
import { TimelineItem } from './timeline-item';
import styles from './timeline.module.css';

export const Timeline = forwardRef<HTMLElement, TimelineProps>(
  (
    { align = 'left', as: Component = 'ol', children, className, color = 'primary', ...rest },
    ref,
  ) => {
    const contextValue = useMemo<TimelineContextValue>(() => ({ align, color }), [align, color]);

    const items = Children.map(children, (child, index) => {
      if (!isValidElement<TimelineItemProps>(child) || child.type !== TimelineItem) {
        return null;
      }
      return cloneElement(child, { index });
    });

    return (
      <TimelineContext.Provider value={contextValue}>
        <Component className={clsx(styles.timeline, styles[align], className)} ref={ref} {...rest}>
          {items}
        </Component>
      </TimelineContext.Provider>
    );
  },
);

Timeline.displayName = 'Timeline';

export default Timeline;
