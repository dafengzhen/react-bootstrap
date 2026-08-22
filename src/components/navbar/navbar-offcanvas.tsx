import clsx from 'clsx';
import {
  type CSSProperties,
  forwardRef,
  type TransitionEvent,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';

import type { NavbarOffcanvasCssProperties, NavbarOffcanvasProps } from './types';

import { useReducedMotion } from '../../hooks';
import { transitionReducer } from '../../stores';
import { getFocusableElements, lockBodyScroll, unlockBodyScroll } from '../../utils';
import { DEFAULT_DURATION, TRANSITION_END_BUFFER } from './navbar-constants';
import { useNavbar } from './navbar-context';

export const NavbarOffcanvas = forwardRef<HTMLDivElement, NavbarOffcanvasProps>(
  (
    {
      backdrop = true,
      children,
      className,
      duration = DEFAULT_DURATION,
      keyboard = true,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExited,
      onExiting,
      onHide,
      placement = 'start',
      scroll = false,
      style,
      tabIndex = -1,
      ...rest
    },
    ref,
  ) => {
    const navbar = useNavbar();
    const show = navbar?.expanded ?? false;

    const [state, dispatch] = useReducer(transitionReducer, {
      mounted: show,
      status: show ? 'opened' : 'closed',
    });

    const panelRef = useRef<HTMLDivElement | null>(null);
    const callbacksRef = useRef({ onEnter, onEntered, onEntering, onExit, onExited, onExiting });
    const previousActiveElementRef = useRef<HTMLElement | null>(null);
    const previousMountedRef = useRef(state.mounted);
    const previousShowRef = useRef(show);
    const previousStatusRef = useRef(state.status);
    const rafRef = useRef<null | number>(null);
    const transitionTimeoutRef = useRef<null | number>(null);

    const reducedMotion = useReducedMotion();
    const effectiveDuration = reducedMotion ? 0 : duration;
    const isVisible = state.status === 'opening' || state.status === 'opened';

    useEffect(() => {
      callbacksRef.current = { onEnter, onEntered, onEntering, onExit, onExited, onExiting };
    });

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

    const handleClose = useCallback(() => {
      navbar?.onToggle();
      onHide?.();
    }, [navbar, onHide]);

    const handleBackdropClick = useCallback(() => {
      if (backdrop === 'static') {
        return;
      }
      handleClose();
    }, [backdrop, handleClose]);

    const handleTransitionEnd = useCallback(
      (event: TransitionEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget || event.propertyName !== 'transform') {
          return;
        }
        if (state.status === 'opening' || state.status === 'closing') {
          dispatch({ type: 'ANIMATION_END' });
        }
      },
      [state.status],
    );

    const setPanelRef = useCallback(
      (node: HTMLDivElement | null) => {
        panelRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const restoreFocus = useCallback(() => {
      previousActiveElementRef.current?.focus?.();
      previousActiveElementRef.current = null;
    }, []);

    useEffect(() => {
      const previous = previousShowRef.current;
      previousShowRef.current = show;
      if (show === previous) {
        return;
      }
      if (show) {
        callbacksRef.current.onEnter?.();
        dispatch({ type: 'OPEN' });
      } else {
        callbacksRef.current.onExit?.();
        dispatch({ type: 'CLOSE' });
      }
    }, [show]);

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

    useEffect(() => {
      const previous = previousStatusRef.current;
      previousStatusRef.current = state.status;
      if (state.status === 'opening' && previous !== 'opening') {
        callbacksRef.current.onEntering?.();
      } else if (state.status === 'opened' && previous !== 'opened') {
        callbacksRef.current.onEntered?.();
      } else if (state.status === 'closing' && previous !== 'closing') {
        callbacksRef.current.onExiting?.();
      }
    }, [state.status]);

    useEffect(() => {
      const previous = previousMountedRef.current;
      previousMountedRef.current = state.mounted;
      if (previous && !state.mounted) {
        callbacksRef.current.onExited?.();
      }
    }, [state.mounted]);

    useEffect(() => {
      if (state.mounted && !previousActiveElementRef.current) {
        previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      }
      if (!state.mounted) {
        restoreFocus();
      }
    }, [restoreFocus, state.mounted]);

    useEffect(() => restoreFocus, [restoreFocus]);

    useEffect(() => {
      if (!isVisible || !state.mounted) {
        return;
      }
      panelRef.current?.focus?.();
    }, [isVisible, state.mounted]);

    useEffect(() => {
      if (!isVisible || !state.mounted) {
        return;
      }
      const panel = panelRef.current;
      if (!panel) {
        return;
      }
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
      if (!state.mounted || scroll) {
        return;
      }
      lockBodyScroll();
      return () => {
        unlockBodyScroll();
      };
    }, [scroll, state.mounted]);

    useEffect(
      () => () => {
        clearAnimationFrame();
        clearTransitionTimeout();
      },
      [clearAnimationFrame, clearTransitionTimeout],
    );

    const mergedStyle = useMemo<CSSProperties>(
      () =>
        ({
          ...style,
          '--bs-offcanvas-transition': `transform ${effectiveDuration}ms ease-in-out`,
        }) as NavbarOffcanvasCssProperties,
      [effectiveDuration, style],
    );

    const backdropElement =
      backdrop !== false && state.mounted && typeof document !== 'undefined'
        ? createPortal(
            <div
              aria-hidden="true"
              className={clsx('offcanvas-backdrop', 'fade', isVisible && 'show')}
              onClick={handleBackdropClick}
              style={{ transition: `opacity ${effectiveDuration}ms linear` }}
            />,
            document.body,
          )
        : null;

    return (
      <>
        <div
          className={clsx(
            'offcanvas',
            `offcanvas-${placement}`,
            isVisible && 'show',
            state.status === 'opening' && 'showing',
            state.status === 'closing' && 'hiding',
            className,
          )}
          onTransitionEnd={handleTransitionEnd}
          ref={setPanelRef}
          style={mergedStyle}
          tabIndex={tabIndex}
          {...rest}
        >
          {children}
        </div>
        {backdropElement}
      </>
    );
  },
);

NavbarOffcanvas.displayName = 'NavbarOffcanvas';

export default NavbarOffcanvas;
