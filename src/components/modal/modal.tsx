import clsx from 'clsx';
import {
  Children,
  forwardRef,
  isValidElement,
  type MouseEvent,
  type TransitionEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';

import type { ModalContextValue, ModalCssProperties, ModalProps } from './types';

import { DEFAULT_DURATION, TRANSITION_END_BUFFER } from './constants';
import { ModalContext } from './context';
import { useReducedMotion } from './hooks';
import { ModalContent } from './modal-content';
import { ModalDialog } from './modal-dialog';
import styles from './modal.module.css';
import { modalReducer } from './reducer';
import { getFocusableElements, lockBodyScroll, unlockBodyScroll } from './utils';

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    {
      ariaLabel,
      backdrop = true,
      backdropClassName,
      backdropStyle,
      centered = false,
      children,
      className,
      contentClassName,
      contentStyle,
      dialogClassName,
      dialogStyle,
      duration = DEFAULT_DURATION,
      fullscreen = false,
      isOpen = false,
      keyboard = true,
      onOpenChange,
      scrollable = false,
      size,
      style,
      ...restProps
    },
    ref,
  ) => {
    const titleId = useId();

    const [state, dispatch] = useReducer(modalReducer, {
      mounted: isOpen,
      status: isOpen ? 'opened' : 'closed',
    });

    const rafRef = useRef<null | number>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);
    const transitionTimeoutRef = useRef<null | number>(null);

    const reducedMotion = useReducedMotion();
    const effectiveDuration = reducedMotion ? 0 : duration;
    const isVisible = state.status === 'opening' || state.status === 'opened';

    const handleClose = useCallback(() => {
      if (state.status === 'closed' || state.status === 'closing') {
        return;
      }
      onOpenChange?.(false);
    }, [onOpenChange, state.status]);

    const handleContentTransitionEnd = useCallback((event: TransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return;
      }

      dispatch({ type: 'ANIMATION_END' });
    }, []);

    const contextValue = useMemo<ModalContextValue>(
      () => ({
        close: handleClose,
        contentRef,
        handleContentTransitionEnd,
        status: state.status,
        titleId,
      }),
      [handleClose, handleContentTransitionEnd, state.status, titleId],
    );

    const animationStyle = useMemo<ModalCssProperties>(
      () => ({
        '--modal-duration': `${effectiveDuration}ms`,
      }),
      [effectiveDuration],
    );

    const mergedStyle = useMemo(() => ({ ...style, ...animationStyle }), [style, animationStyle]);

    const clearAnimationFrame = useCallback(() => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }, []);

    const clearTransitionTimeout = useCallback(() => {
      if (transitionTimeoutRef.current !== null) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    }, []);

    const scheduleOpenAnimation = useCallback(() => {
      clearAnimationFrame();
      clearTransitionTimeout();
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          dispatch({ type: 'ANIMATION_START' });
          rafRef.current = null;
        });
      });
    }, [clearAnimationFrame, clearTransitionTimeout]);

    const scheduleTransitionSafety = useCallback(() => {
      clearTransitionTimeout();
      if (effectiveDuration === 0) {
        return;
      }
      transitionTimeoutRef.current = window.setTimeout(() => {
        if (state.status === 'opening' || state.status === 'closing') {
          dispatch({ type: 'ANIMATION_END' });
        }
        transitionTimeoutRef.current = null;
      }, effectiveDuration + TRANSITION_END_BUFFER);
    }, [effectiveDuration, state.status, clearTransitionTimeout]);

    useEffect(() => {
      if (isOpen) {
        dispatch({ type: 'OPEN' });
      } else {
        dispatch({ type: 'CLOSE' });
      }
    }, [isOpen]);

    useEffect(() => {
      if (state.status === 'closed' && state.mounted) {
        if (effectiveDuration === 0) {
          dispatch({ type: 'INSTANT_OPEN' });
        } else {
          scheduleOpenAnimation();
        }
      } else if (state.status === 'closing' && effectiveDuration === 0) {
        dispatch({ type: 'ANIMATION_END' });
      } else if (state.status === 'opening' && effectiveDuration === 0) {
        dispatch({ type: 'ANIMATION_END' });
      }

      if (state.status === 'opening' || state.status === 'closing') {
        scheduleTransitionSafety();
      } else {
        clearTransitionTimeout();
      }
    }, [
      state.status,
      state.mounted,
      effectiveDuration,
      scheduleOpenAnimation,
      scheduleTransitionSafety,
      clearTransitionTimeout,
    ]);

    useEffect(() => {
      return () => {
        clearAnimationFrame();
        clearTransitionTimeout();
      };
    }, [clearAnimationFrame, clearTransitionTimeout]);

    const restorePreviousFocus = useCallback(() => {
      previousActiveElementRef.current?.focus?.();
      previousActiveElementRef.current = null;
    }, []);

    useEffect(() => {
      if (state.mounted && !previousActiveElementRef.current) {
        previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      }

      if (!state.mounted) {
        restorePreviousFocus();
      }
    }, [restorePreviousFocus, state.mounted]);

    useEffect(() => restorePreviousFocus, [restorePreviousFocus]);

    useEffect(() => {
      if (!state.mounted || !keyboard) {
        return;
      }
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleClose, keyboard, state.mounted]);

    useEffect(() => {
      if (!state.mounted || !isVisible) {
        return;
      }
      const container = contentRef.current;
      if (!container) {
        return;
      }

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        container.focus();
      }

      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') {
          return;
        }
        const focusable = getFocusableElements(container);
        if (focusable.length === 0) {
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }, [isVisible, state.mounted]);

    useEffect(() => {
      if (!state.mounted) {
        return;
      }
      lockBodyScroll();
      return () => {
        unlockBodyScroll();
      };
    }, [state.mounted]);

    const handleOverlayClick = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        if (backdrop === 'static' || event.target !== event.currentTarget) {
          return;
        }
        handleClose();
      },
      [backdrop, handleClose],
    );

    const childArray = Children.toArray(children);
    const hasCustomFrame = childArray.some(
      (child) =>
        isValidElement(child) && (child.type === ModalContent || child.type === ModalDialog),
    );

    if (typeof document === 'undefined' || !state.mounted) {
      return null;
    }

    const modalClasses = clsx(styles.modal, className, {
      [styles.modalReducedMotion]: effectiveDuration === 0,
    });

    const ariaProps = ariaLabel ? { 'aria-label': ariaLabel } : { 'aria-labelledby': titleId };

    return createPortal(
      <ModalContext.Provider value={contextValue}>
        <dialog
          aria-modal="true"
          className={modalClasses}
          data-status={state.status}
          open
          ref={ref}
          style={mergedStyle}
          {...ariaProps}
          {...restProps}
        >
          {backdrop !== false ? (
            <div
              aria-hidden="true"
              className={clsx(styles.modalBackdrop, backdropClassName)}
              onClick={handleOverlayClick}
              role="presentation"
              style={backdropStyle}
            />
          ) : (
            <div
              aria-hidden="true"
              className={styles.modalBackdropTransparent}
              onClick={handleOverlayClick}
              role="presentation"
            />
          )}
          {hasCustomFrame ? (
            children
          ) : (
            <ModalDialog
              centered={centered}
              className={dialogClassName}
              fullscreen={fullscreen}
              scrollable={scrollable}
              size={size}
              style={dialogStyle}
            >
              <ModalContent className={contentClassName} style={contentStyle}>
                {children}
              </ModalContent>
            </ModalDialog>
          )}
        </dialog>
      </ModalContext.Provider>,
      document.body,
    );
  },
);

Modal.displayName = 'Modal';

export default Modal;
