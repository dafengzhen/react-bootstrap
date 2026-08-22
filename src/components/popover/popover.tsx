import clsx from 'clsx';
import { type CSSProperties, forwardRef } from 'react';

import type { PopoverProps } from './types';

import { getBasePlacement } from '../../utils';
import { DEFAULT_PLACEMENT } from './popover-constants';
import styles from './popover.module.css';

const getArrowStyle = (placement: PopoverProps['placement']): CSSProperties => {
  const basePlacement = getBasePlacement(placement ?? DEFAULT_PLACEMENT);
  const isVertical = basePlacement === 'top' || basePlacement === 'bottom';
  return {
    position: 'absolute',
    ...(isVertical
      ? { left: '50%', transform: 'translateX(-50%)' }
      : { top: '50%', transform: 'translateY(-50%)' }),
  };
};

export const Popover = forwardRef<HTMLElement, PopoverProps>(
  (
    {
      animation = true,
      arrowProps,
      as: Component = 'div',
      bodyProps,
      children,
      className,
      flip = true,
      headerProps,
      id,
      placement = DEFAULT_PLACEMENT,
      show = true,
      style,
      title,
      ...rest
    },
    ref,
  ) => {
    const hasTitle = title != null && title !== '';

    return (
      <Component
        className={clsx(
          'popover',
          flip ? 'bs-popover-auto' : `bs-popover-${getBasePlacement(placement)}`,
          animation && 'fade',
          show && 'show',
          hasTitle && styles.hasHeader,
          className,
        )}
        data-popper-placement={placement}
        id={id}
        ref={ref}
        role="tooltip"
        style={style}
        {...rest}
      >
        <div
          className="popover-arrow"
          {...arrowProps}
          style={{ ...getArrowStyle(placement), ...arrowProps?.style }}
        />
        {hasTitle && (
          <h3 className="popover-header" {...headerProps}>
            {title}
          </h3>
        )}
        <div className="popover-body" {...bodyProps}>
          {children}
        </div>
      </Component>
    );
  },
);

Popover.displayName = 'Popover';

export default Popover;
