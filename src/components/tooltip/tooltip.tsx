import clsx from 'clsx';
import { type CSSProperties, forwardRef } from 'react';

import type { TooltipProps } from './types';

import { getBasePlacement } from '../../utils';
import { DEFAULT_PLACEMENT } from './tooltip-constants';

const getArrowStyle = (placement: TooltipProps['placement']): CSSProperties => {
  const basePlacement = getBasePlacement(placement ?? DEFAULT_PLACEMENT);
  const isVertical = basePlacement === 'top' || basePlacement === 'bottom';
  return {
    position: 'absolute',
    ...(isVertical
      ? { left: '50%', transform: 'translateX(-50%)' }
      : { top: '50%', transform: 'translateY(-50%)' }),
  };
};

export const Tooltip = forwardRef<HTMLElement, TooltipProps>(
  (
    {
      animation = true,
      arrowProps,
      as: Component = 'div',
      children,
      className,
      flip = true,
      id,
      placement = DEFAULT_PLACEMENT,
      show = true,
      style,
      ...rest
    },
    ref,
  ) => (
    <Component
      className={clsx(
        'tooltip',
        flip ? 'bs-tooltip-auto' : `bs-tooltip-${getBasePlacement(placement)}`,
        animation && 'fade',
        show && 'show',
        className,
      )}
      data-popper-placement={placement}
      id={id}
      ref={ref}
      role="tooltip"
      style={{ pointerEvents: 'none', ...style }}
      {...rest}
    >
      <div
        className="tooltip-arrow"
        {...arrowProps}
        style={{ ...getArrowStyle(placement), ...arrowProps?.style }}
      />
      <div className="tooltip-inner">{children}</div>
    </Component>
  ),
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;
