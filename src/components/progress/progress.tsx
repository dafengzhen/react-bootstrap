import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ProgressProps } from './types';

import { useProgressStacked } from './context';
import { ProgressBar } from './progress-bar';
import { mergeProgressStyle, resolveProgressWidth } from './utils';

export const Progress = forwardRef<HTMLElement, ProgressProps>(
  (
    {
      animated = false,
      'aria-labelledby': ariaLabelledby,
      as: Component = 'div',
      bar = true,
      barAs,
      barProps,
      children,
      className,
      height,
      label = 'progress',
      max = 100,
      min = 0,
      now = 0,
      role = 'progressbar',
      striped = false,
      style,
      textBg = false,
      variant,
      ...rest
    },
    ref,
  ) => {
    const stacked = useProgressStacked();
    const isStacked = stacked !== null;

    return (
      <Component
        aria-label={ariaLabelledby ? undefined : label}
        aria-labelledby={ariaLabelledby}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={now}
        className={clsx('progress', className)}
        ref={ref}
        role={role}
        style={mergeProgressStyle(
          style,
          height ?? stacked?.height,
          isStacked ? resolveProgressWidth(now, min, max) : undefined,
        )}
        {...rest}
      >
        {bar ? (
          <ProgressBar
            animated={animated}
            as={barAs}
            striped={striped}
            textBg={textBg}
            variant={variant}
            {...(isStacked ? undefined : { max, min, now })}
            {...barProps}
          >
            {children}
          </ProgressBar>
        ) : (
          children
        )}
      </Component>
    );
  },
);

Progress.displayName = 'Progress';

export default Progress;
