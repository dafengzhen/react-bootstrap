import clsx from 'clsx';
import {
  forwardRef,
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

import type { DialogCssProperties, DialogPlacement, DialogProps } from './types';

import { DEFAULT_DURATION, TRANSITION_END_BUFFER } from './constants';
import { DialogContext } from './context';
import styles from './dialog.module.css';
import { useReducedMotion } from './hooks';
import { dialogReducer } from './reducer';
import { getFocusableElements, lockBodyScroll, toCssSize, unlockBodyScroll } from './utils';

const CONTENT_PLACEMENT_CLASSES: Record<DialogPlacement, string> = {
  bottom: styles.dialogContentBottom,
  center: styles.dialogContentCenter,
  left: styles.dialogContentLeft,
  right: styles.dialogContentRight,
  top: styles.dialogContentTop,
};

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  (
    {
      ariaLabel,
      backdropClassName,
      backdropStyle,
      children,
      className,
      closeOnBackdropClick = true,
      contentClassName,
      contentStyle,
      duration = DEFAULT_DURATION,
      height,
      isOpen = false,
      maxWidth,
      onOpenChange,
      placement = 'center',
      showBackdrop = true,
      style,
      width,
      ...restProps
    },
    ref,
  ) => {
    const titleId = useId();
    const descriptionId = useId();

    const [state, dispatch] = useReducer(dialogReducer, {
      mounted: isOpen,
      status: isOpen ? 'opened' : 'closed',
    });

    const rafRef = useRef<null | number>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
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

    const contextValue = useMemo(
      () => ({ close: handleClose, descriptionId, titleId }),
      [titleId, descriptionId, handleClose],
    );

    const animationStyle = useMemo<DialogCssProperties>(() => {
      const stylesValue: DialogCssProperties = {
        '--dialog-duration': `${effectiveDuration}ms`,
      };
      const dialogWidth = toCssSize(width);
      const dialogHeight = toCssSize(height);
      const dialogMaxWidth = toCssSize(maxWidth);
      if (dialogWidth) {
        stylesValue['--dialog-width'] = dialogWidth;
      }
      if (dialogHeight) {
        stylesValue['--dialog-height'] = dialogHeight;
      }
      if (dialogMaxWidth) {
        stylesValue['--dialog-max-width'] = dialogMaxWidth;
      }
      return stylesValue;
    }, [effectiveDuration, width, height, maxWidth]);

    const mergedDialogStyle = useMemo(
      () => ({ ...style, ...backdropStyle, ...animationStyle }),
      [style, backdropStyle, animationStyle],
    );
    const mergedContentStyle = useMemo(
      () => ({ ...contentStyle, ...animationStyle }),
      [contentStyle, animationStyle],
    );

    const setDialogRef = useCallback(
      (node: HTMLDialogElement | null) => {
        dialogRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

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
      if (!state.mounted) {
        return;
      }
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleClose, state.mounted]);

    useEffect(() => {
      if (!state.mounted || !isVisible) {
        return;
      }
      const container = dialogRef.current;
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

    const handleTransitionEnd = useCallback((event: TransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return;
      }

      dispatch({ type: 'ANIMATION_END' });
    }, []);

    const handleBackdropClick = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        if (closeOnBackdropClick && event.target === event.currentTarget) {
          handleClose();
        }
      },
      [closeOnBackdropClick, handleClose],
    );

    if (typeof document === 'undefined' || !state.mounted) {
      return null;
    }

    const dialogClasses = clsx(
      styles.dialog,
      `dialog-${placement}`,
      className,
      {
        [styles.dialogMask]: showBackdrop,
        [styles.dialogReducedMotion]: effectiveDuration === 0,
        [styles.dialogTransparent]: !showBackdrop,
        [styles.dialogVisible]: isVisible,
      },
      backdropClassName,
    );

    const contentClasses = clsx(
      styles.dialogContent,
      CONTENT_PLACEMENT_CLASSES[placement],
      {
        [styles.dialogContentReducedMotion]: effectiveDuration === 0,
        [styles.dialogContentVisible]: isVisible,
      },
      contentClassName,
    );

    const ariaProps = ariaLabel ? { 'aria-label': ariaLabel } : { 'aria-labelledby': titleId };

    return createPortal(
      <DialogContext.Provider value={contextValue}>
        <dialog
          aria-describedby={descriptionId}
          aria-modal="true"
          className={dialogClasses}
          data-status={state.status}
          open
          ref={setDialogRef}
          style={mergedDialogStyle}
          tabIndex={-1}
          {...ariaProps}
          {...restProps}
        >
          <div
            aria-hidden="true"
            className={styles.dialogBackdrop}
            onClick={handleBackdropClick}
            role="presentation"
          />
          <div
            className={contentClasses}
            data-status={state.status}
            onTransitionEnd={handleTransitionEnd}
            style={mergedContentStyle}
          >
            {children}
          </div>
        </dialog>
      </DialogContext.Provider>,
      document.body,
    );
  },
);

Dialog.displayName = 'Dialog';

export default Dialog;
