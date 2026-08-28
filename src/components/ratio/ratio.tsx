import clsx from 'clsx';
import { Children, type CSSProperties, forwardRef } from 'react';

import type { RatioProps } from './types';

export const Ratio = forwardRef<HTMLElement, RatioProps>(
  ({ as: Component = 'div', aspectRatio = '1x1', children, className, style, ...rest }, ref) => {
    const customRatio =
      typeof aspectRatio === 'number' ? resolveRatioPercent(aspectRatio) : undefined;

    return (
      <Component
        className={clsx('ratio', customRatio === undefined && `ratio-${aspectRatio}`, className)}
        ref={ref}
        style={
          customRatio === undefined
            ? style
            : ({ ...style, '--bs-aspect-ratio': customRatio } as CSSProperties)
        }
        {...rest}
      >
        {Children.only(children)}
      </Component>
    );
  },
);

const resolveRatioPercent = (ratio: number): string => {
  if (ratio <= 0) {
    return '100%';
  }

  return ratio < 1 ? `${ratio * 100}%` : `${ratio}%`;
};

Ratio.displayName = 'Ratio';

export default Ratio;
