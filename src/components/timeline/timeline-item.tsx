import clsx from 'clsx';
import { forwardRef } from 'react';

import type { TimelineItemProps } from './types';

import { useTimeline } from './timeline-context';
import { resolveTimelineSide } from './timeline-utils';
import styles from './timeline.module.css';

export const TimelineItem = forwardRef<HTMLElement, TimelineItemProps>(
  (
    {
      as: Component = 'li',
      children,
      className,
      color,
      description,
      dot,
      index = 0,
      time,
      title,
      ...rest
    },
    ref,
  ) => {
    const context = useTimeline();
    const resolvedColor = color ?? context?.color ?? 'primary';
    const side = resolveTimelineSide(context?.align ?? 'left', index);

    return (
      <Component
        className={clsx(styles.item, className)}
        data-color={resolvedColor}
        data-side={side ?? undefined}
        ref={ref}
        {...rest}
      >
        <span className={clsx(styles.dot, dot === undefined && styles.dotDefault)}>{dot}</span>
        <div className={styles.content}>
          {time !== undefined && <span className={styles.time}>{time}</span>}
          {title !== undefined && <div className={styles.title}>{title}</div>}
          {description !== undefined && <div className={styles.description}>{description}</div>}
          {children}
        </div>
      </Component>
    );
  },
);

TimelineItem.displayName = 'TimelineItem';

export default TimelineItem;
