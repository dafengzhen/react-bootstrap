import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ModalDialogProps, ModalFullscreen, ModalSize } from './types';

import styles from './modal.module.css';

const FULLSCREEN_CLASSES: Record<Exclude<ModalFullscreen, boolean>, string> = {
  'lg-down': styles.modalFullscreenLgDown,
  'md-down': styles.modalFullscreenMdDown,
  'sm-down': styles.modalFullscreenSmDown,
  'xl-down': styles.modalFullscreenXlDown,
  'xxl-down': styles.modalFullscreenXxlDown,
};

const SIZE_CLASSES: Record<ModalSize, string> = {
  lg: styles.modalLg,
  sm: styles.modalSm,
  xl: styles.modalXl,
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
        styles.modalDialog,
        size && SIZE_CLASSES[size],
        fullscreen === true && styles.modalFullscreen,
        typeof fullscreen === 'string' && FULLSCREEN_CLASSES[fullscreen],
        centered && styles.modalDialogCentered,
        scrollable && styles.modalDialogScrollable,
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
