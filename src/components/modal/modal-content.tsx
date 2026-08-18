import clsx from 'clsx';
import { forwardRef, useCallback } from 'react';

import type { ModalContentProps } from './types';

import { useModal } from './context';
import styles from './modal.module.css';

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, className, ...rest }, ref) => {
    const { contentRef, handleContentTransitionEnd, status } = useModal();

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

    return (
      <div
        className={clsx(styles.modalContent, className)}
        data-status={status}
        onTransitionEnd={handleContentTransitionEnd}
        ref={setContentRef}
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
