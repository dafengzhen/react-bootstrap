import clsx from 'clsx';
import { type CSSProperties, forwardRef } from 'react';

import type { ScrollShadowDirection, ScrollShadowProps } from './types';

import { isScrollAxisTracked } from './scroll-shadow-utils';
import styles from './scroll-shadow.module.css';
import { useScrollShadow } from './use-scroll-shadow';

const VIEWPORT_CLASSES: Record<ScrollShadowDirection, string> = {
  both: styles.viewportBoth,
  horizontal: styles.viewportHorizontal,
  vertical: styles.viewportVertical,
};

export const ScrollShadow = forwardRef<HTMLElement, ScrollShadowProps>(
  (
    {
      as: Component = 'div',
      children,
      className,
      direction = 'vertical',
      disabled = false,
      onChange,
      onScroll,
      shadowColor,
      shadowSize,
      style,
      tabIndex,
      ...rest
    },
    ref,
  ) => {
    const { ref: viewportRef, visibility } = useScrollShadow({ direction, disabled, onChange });

    const trackHorizontal = isScrollAxisTracked(direction, 'horizontal');
    const trackVertical = isScrollAxisTracked(direction, 'vertical');

    const cssVariables = {
      ...(shadowColor === undefined ? {} : { '--rbs-scroll-shadow-color': shadowColor }),
      ...(shadowSize === undefined ? {} : { '--rbs-scroll-shadow-size': `${shadowSize}px` }),
    } as CSSProperties;

    return (
      <Component
        className={clsx(styles.scrollShadow, className)}
        ref={ref}
        style={{ ...style, ...cssVariables }}
        {...rest}
      >
        <div
          className={clsx(styles.viewport, VIEWPORT_CLASSES[direction])}
          onScroll={onScroll}
          ref={viewportRef}
          tabIndex={tabIndex}
        >
          {children}
        </div>
        {!disabled && trackVertical && (
          <>
            <div
              aria-hidden="true"
              className={clsx(
                styles.shadow,
                styles.shadowTop,
                visibility.top && styles.shadowVisible,
              )}
            />
            <div
              aria-hidden="true"
              className={clsx(
                styles.shadow,
                styles.shadowBottom,
                visibility.bottom && styles.shadowVisible,
              )}
            />
          </>
        )}
        {!disabled && trackHorizontal && (
          <>
            <div
              aria-hidden="true"
              className={clsx(
                styles.shadow,
                styles.shadowLeft,
                visibility.left && styles.shadowVisible,
              )}
            />
            <div
              aria-hidden="true"
              className={clsx(
                styles.shadow,
                styles.shadowRight,
                visibility.right && styles.shadowVisible,
              )}
            />
          </>
        )}
      </Component>
    );
  },
);

ScrollShadow.displayName = 'ScrollShadow';

export default ScrollShadow;
