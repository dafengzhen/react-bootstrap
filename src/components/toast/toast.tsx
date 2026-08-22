import clsx from 'clsx';
import {
  forwardRef,
  type TransitionEvent,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import type { ToastContextValue, ToastCssProperties, ToastProps } from './types';

import { useReducedMotion } from '../../hooks';
import { transitionReducer } from '../../stores';
import { DEFAULT_AUTOHIDE_DELAY, DEFAULT_DURATION, TRANSITION_END_BUFFER } from './toast-constants';
import { ToastContext } from './toast-context';
import styles from './toast.module.css';

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      'aria-atomic': ariaAtomic = true,
      'aria-live': ariaLive = 'assertive',
      autohide = true,
      children,
      className,
      delay = DEFAULT_AUTOHIDE_DELAY,
      duration = DEFAULT_DURATION,
      onClose,
      role = 'alert',
      show,
      style,
      variant,
      ...rest
    },
    ref,
  ) => {
    const isControlled = show !== undefined;
    const [internalShow, setInternalShow] = useState(true);
    const isShown = isControlled ? show : internalShow;

    const [state, dispatch] = useReducer(transitionReducer, {
      mounted: isShown,
      status: isShown ? 'opened' : 'closed',
    });

    const [isHovered, setIsHovered] = useState(false);

    const onCloseRef = useRef(onClose);
    const rafRef = useRef<null | number>(null);
    const transitionTimeoutRef = useRef<null | number>(null);

    const reducedMotion = useReducedMotion();
    const effectiveDuration = reducedMotion ? 0 : duration;

    useEffect(() => {
      onCloseRef.current = onClose;
    }, [onClose]);

    const handleClose = useCallback(() => {
      if (state.status === 'closed' || state.status === 'closing') {
        return;
      }
      onCloseRef.current?.();
      if (!isControlled) {
        setInternalShow(false);
      }
    }, [isControlled, state.status]);

    const handleTransitionEnd = useCallback(
      (event: TransitionEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget || event.propertyName !== 'opacity') {
          return;
        }
        if (state.status === 'opening' || state.status === 'closing') {
          dispatch({ type: 'ANIMATION_END' });
        }
      },
      [state.status],
    );

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    const contextValue = useMemo<ToastContextValue>(
      () => ({ close: handleClose, status: state.status, variant }),
      [handleClose, state.status, variant],
    );

    const baseStyle = useMemo<ToastCssProperties>(
      () => ({ '--rbs-toast-duration': `${effectiveDuration}ms` }),
      [effectiveDuration],
    );

    const mergedStyle = useMemo(() => ({ ...style, ...baseStyle }), [baseStyle, style]);

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
      if (isShown) {
        dispatch({ type: 'OPEN' });
      } else {
        dispatch({ type: 'CLOSE' });
      }
    }, [isShown]);

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

    useEffect(() => {
      if (!autohide || !isShown || isHovered || state.status !== 'opened') {
        return;
      }
      const hideTimer = window.setTimeout(handleClose, delay);
      return () => window.clearTimeout(hideTimer);
    }, [autohide, delay, handleClose, isHovered, isShown, state.status]);

    if (!state.mounted) {
      return null;
    }

    return (
      <ToastContext.Provider value={contextValue}>
        <div
          aria-atomic={ariaAtomic}
          aria-live={ariaLive}
          className={clsx(
            'toast',
            styles.toast,
            variant && `text-bg-${variant}`,
            effectiveDuration === 0 && styles.toastReducedMotion,
            className,
          )}
          data-status={state.status}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTransitionEnd={handleTransitionEnd}
          ref={ref}
          role={role}
          style={mergedStyle}
          {...rest}
        >
          {children}
        </div>
      </ToastContext.Provider>
    );
  },
);

Toast.displayName = 'Toast';

export default Toast;
