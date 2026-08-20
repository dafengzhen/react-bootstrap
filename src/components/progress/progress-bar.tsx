import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ProgressBarProps } from './types';

import { mergeProgressStyle, resolveProgressWidth } from './utils';

export const ProgressBar = forwardRef<HTMLElement, ProgressBarProps>(
  (
    {
      animated = false,
      as: Component = 'div',
      children,
      className,
      max = 100,
      min = 0,
      now,
      striped = false,
      style,
      textBg = false,
      variant,
      ...rest
    },
    ref,
  ) => (
    <Component
      className={clsx(
        'progress-bar',
        variant && (textBg ? `text-bg-${variant}` : `bg-${variant}`),
        (animated || striped) && 'progress-bar-striped',
        animated && 'progress-bar-animated',
        className,
      )}
      ref={ref}
      style={mergeProgressStyle(
        style,
        undefined,
        now === undefined ? undefined : resolveProgressWidth(now, min, max),
      )}
      {...rest}
    >
      {children}
    </Component>
  ),
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
