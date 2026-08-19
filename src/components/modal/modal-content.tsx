import clsx from 'clsx';
import { forwardRef, useCallback } from 'react';

import type { ModalContentProps, ModalDirection, ModalPlacement } from './types';

import { useModal } from './context';
import styles from './modal.module.css';

const PLACEMENT_CONTENT_CLASSES: Partial<Record<ModalPlacement, string>> = {
  bottom: styles.modalContentPlacementBottom,
  center: styles.modalContentPlacementCenter,
  left: styles.modalContentPlacementLeft,
  right: styles.modalContentPlacementRight,
  top: styles.modalContentPlacementTop,
};

const DIRECTION_CONTENT_CLASSES: Record<ModalDirection, string> = {
  bottom: styles.modalContentDirectionBottom,
  center: styles.modalContentDirectionCenter,
  left: styles.modalContentDirectionLeft,
  right: styles.modalContentDirectionRight,
  top: styles.modalContentDirectionTop,
};

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, className, style: contentStyle, ...rest }, ref) => {
    const {
      backdrop,
      contentRef,
      direction,
      handleContentTransitionEnd,
      placement,
      sizingStyle,
      status,
    } = useModal();

    const setContentRef = useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [contentRef, ref],
    );

    const isPlacementMode = placement !== undefined;
    const isDirectionMode = direction !== undefined;

    return (
      <div
        className={clsx(
          'modal-content',
          styles.modalContent,
          backdrop === false && 'shadow-lg',
          isPlacementMode && styles.modalContentPlacement,
          isPlacementMode && PLACEMENT_CONTENT_CLASSES[placement],
          !isPlacementMode && isDirectionMode && DIRECTION_CONTENT_CLASSES[direction],
          className,
        )}
        data-status={status}
        onTransitionEnd={handleContentTransitionEnd}
        ref={setContentRef}
        style={{ ...sizingStyle, ...contentStyle }}
        tabIndex={-1}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ModalContent.displayName = 'ModalContent';

export default ModalContent;
