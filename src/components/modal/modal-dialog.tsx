import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ModalDialogProps, ModalFullscreen, ModalSize } from './types';

const FULLSCREEN_CLASSES: Record<Exclude<ModalFullscreen, boolean>, string> = {
  'lg-down': 'modal-fullscreen-lg-down',
  'md-down': 'modal-fullscreen-md-down',
  'sm-down': 'modal-fullscreen-sm-down',
  'xl-down': 'modal-fullscreen-xl-down',
  'xxl-down': 'modal-fullscreen-xxl-down',
};

const SIZE_CLASSES: Record<ModalSize, string> = {
  lg: 'modal-lg',
  sm: 'modal-sm',
  xl: 'modal-xl',
};

export const ModalDialog = forwardRef<HTMLDivElement, ModalDialogProps>(
  (
    {
      centered = false,
      children,
      className,
      fullscreen = false,
      scrollable = false,
      size,
      ...rest
    },
    ref,
  ) => (
    <div
      className={clsx(
        'modal-dialog',
        size && SIZE_CLASSES[size],
        fullscreen === true && 'modal-fullscreen',
        typeof fullscreen === 'string' && FULLSCREEN_CLASSES[fullscreen],
        centered && 'modal-dialog-centered',
        scrollable && 'modal-dialog-scrollable',
        className,
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  ),
);

ModalDialog.displayName = 'ModalDialog';

export default ModalDialog;
