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

import type {
  OffcanvasContextValue,
  OffcanvasCssProperties,
  OffcanvasPlacement,
  OffcanvasProps,
} from './types';

import { useReducedMotion } from '../../hooks';
import { transitionReducer } from '../../stores';
import { getFocusableElements, lockBodyScroll, unlockBodyScroll } from '../../utils';
import { DEFAULT_DURATION, TRANSITION_END_BUFFER } from './constants';
import { OffcanvasContext } from './context';
import styles from './offcanvas.module.css';

const PLACEMENT_CLASSES: Record<OffcanvasPlacement, string> = {
  bottom: styles.offcanvasPlacementBottom,
  end: styles.offcanvasPlacementEnd,
  start: styles.offcanvasPlacementStart,
  top: styles.offcanvasPlacementTop,
};

export const Offcanvas = forwardRef<HTMLDialogElement, OffcanvasProps>(
  (
    {
      ariaLabel,
      backdrop = true,
      backdropClassName,
      backdropStyle,
      children,
      className,
      duration = DEFAULT_DURATION,
      isOpen = false,
      keyboard = true,
      onOpenChange,
      placement = 'start',
      scroll = false,
      style,
      ...restProps
    },
    ref,
  ) => {
    const titleId = useId();

    const [state, dispatch] = useReducer(transitionReducer, {
      mounted: isOpen,
      status: isOpen ? 'opened' : 'closed',
    });

    const panelRef = useRef<HTMLDialogElement | null>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);
    const rafRef = useRef<null | number>(null);
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

    const handlePanelTransitionEnd = useCallback(
      (event: TransitionEvent<HTMLDialogElement>) => {
        if (event.target !== event.currentTarget || event.propertyName !== 'transform') {
          return;
        }
        if (state.status === 'opening' || state.status === 'closing') {
          dispatch({ type: 'ANIMATION_END' });
        }
      },
      [state.status],
    );

    const contextValue = useMemo<OffcanvasContextValue>(
      () => ({
        close: handleClose,
        status: state.status,
        titleId,
      }),
      [handleClose, state.status, titleId],
    );

    const baseStyle = useMemo<OffcanvasCssProperties>(
      () => ({ '--rbs-offcanvas-duration': `${effectiveDuration}ms` }),
      [effectiveDuration],
    );

    const mergedStyle = useMemo(() => ({ ...style, ...baseStyle }), [baseStyle, style]);

    const mergedBackdropStyle = useMemo(
      () => ({ ...backdropStyle, ...baseStyle }),
      [backdropStyle, baseStyle],
    );

    const setPanelRef = useCallback(
      (node: HTMLDialogElement | null) => {
        panelRef.current = node;
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
        window.clearTimeout(transitionTimeoutRef.current);
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
    }, [clearTransitionTimeout, effectiveDuration, state.status]);

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
      clearTransitionTimeout,
      effectiveDuration,
      scheduleOpenAnimation,
      scheduleTransitionSafety,
      state.mounted,
      state.status,
    ]);

    useEffect(
      () => () => {
        clearAnimationFrame();
        clearTransitionTimeout();
      },
      [clearAnimationFrame, clearTransitionTimeout],
    );

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
      const panel = panelRef.current;
      if (!panel) {
        return;
      }

      panel.focus();

      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') {
          return;
        }
        const focusable = getFocusableElements(panel);
        if (focusable.length === 0) {
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first || document.activeElement === panel) {
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
      if (!state.mounted || scroll) {
        return;
      }
      lockBodyScroll();
      return () => {
        unlockBodyScroll();
      };
    }, [scroll, state.mounted]);

    const handleBackdropClick = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        if (backdrop === 'static' || event.target !== event.currentTarget) {
          return;
        }
        handleClose();
      },
      [backdrop, handleClose],
    );

    if (typeof document === 'undefined' || !state.mounted) {
      return null;
    }

    const ariaProps = ariaLabel ? { 'aria-label': ariaLabel } : { 'aria-labelledby': titleId };

    return createPortal(
      <OffcanvasContext.Provider value={contextValue}>
        {backdrop !== false ? (
          <div
            aria-hidden="true"
            className={clsx(
              'offcanvas-backdrop',
              styles.offcanvasBackdrop,
              effectiveDuration === 0 && styles.offcanvasReducedMotion,
              backdropClassName,
            )}
            data-status={state.status}
            onClick={handleBackdropClick}
            role="presentation"
            style={mergedBackdropStyle}
          />
        ) : (
          <div
            aria-hidden="true"
            className={styles.offcanvasBackdropTransparent}
            data-status={state.status}
            onClick={handleBackdropClick}
            role="presentation"
          />
        )}
        <dialog
          aria-modal="true"
          className={clsx(
            'offcanvas',
            `offcanvas-${placement}`,
            styles.offcanvas,
            PLACEMENT_CLASSES[placement],
            backdrop === false && 'shadow-lg',
            effectiveDuration === 0 && styles.offcanvasReducedMotion,
            className,
          )}
          data-status={state.status}
          onTransitionEnd={handlePanelTransitionEnd}
          open
          ref={setPanelRef}
          style={mergedStyle}
          tabIndex={-1}
          {...ariaProps}
          {...restProps}
        >
          {children}
        </dialog>
      </OffcanvasContext.Provider>,
      document.body,
    );
  },
);

Offcanvas.displayName = 'Offcanvas';

export default Offcanvas;
