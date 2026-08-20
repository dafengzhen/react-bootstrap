import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ToastContainerProps, ToastPlacement, ToastPosition } from './types';

const PLACEMENT_CLASSES: Record<ToastPlacement, string> = {
  'bottom-center': 'bottom-0 start-50 translate-middle-x',
  'bottom-end': 'bottom-0 end-0',
  'bottom-start': 'bottom-0 start-0',
  'middle-center': 'top-50 start-50 translate-middle',
  'middle-end': 'top-50 end-0 translate-middle-y',
  'middle-start': 'top-50 start-0 translate-middle-y',
  'top-center': 'top-0 start-50 translate-middle-x',
  'top-end': 'top-0 end-0',
  'top-start': 'top-0 start-0',
};

const POSITION_CLASSES: Record<ToastPosition, string> = {
  absolute: 'position-absolute',
  fixed: 'position-fixed',
  static: 'position-static',
};

export const ToastContainer = forwardRef<HTMLDivElement, ToastContainerProps>(
  ({ children, className, placement, position = 'absolute', style, ...rest }, ref) => (
    <div
      className={clsx(
        'toast-container',
        POSITION_CLASSES[position],
        placement && PLACEMENT_CLASSES[placement],
        className,
      )}
      ref={ref}
      style={style}
      {...rest}
    >
      {children}
    </div>
  ),
);

ToastContainer.displayName = 'ToastContainer';

export default ToastContainer;
