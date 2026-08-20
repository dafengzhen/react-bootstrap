import clsx from 'clsx';
import { forwardRef, useMemo } from 'react';

import type { ProgressStackedContextValue, ProgressStackedProps } from './types';

import { ProgressStackedContext } from './context';
import { mergeProgressStyle } from './utils';

export const ProgressStacked = forwardRef<HTMLElement, ProgressStackedProps>(
  ({ as: Component = 'div', children, className, height, style, ...rest }, ref) => {
    const contextValue = useMemo<ProgressStackedContextValue>(() => ({ height }), [height]);

    return (
      <ProgressStackedContext.Provider value={contextValue}>
        <Component
          className={clsx('progress-stacked', className)}
          ref={ref}
          style={mergeProgressStyle(style, height, undefined)}
          {...rest}
        >
          {children}
        </Component>
      </ProgressStackedContext.Provider>
    );
  },
);

ProgressStacked.displayName = 'ProgressStacked';

export default ProgressStacked;
