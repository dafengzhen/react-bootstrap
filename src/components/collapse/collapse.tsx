import clsx from 'clsx';
import {
  forwardRef,
  type TransitionEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import type { CollapseCssProperties, CollapseProps } from './types';

import { useReducedMotion } from '../../hooks';
import { transitionReducer } from '../../stores';
import { DEFAULT_DURATION, TRANSITION_END_BUFFER } from './collapse-constants';
import styles from './collapse.module.css';

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
  (
    {
      children,
      className,
      dimension = 'height',
      duration = DEFAULT_DURATION,
      in: inProp,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExited,
      onExiting,
      style,
      ...rest
    },
    ref,
  ) => {
    const [state, dispatch] = useReducer(transitionReducer, {
      mounted: inProp,
      status: 'closed',
    });

    const [measuredSize, setMeasuredSize] = useState<null | number>(null);

    const callbacksRef = useRef({ onEnter, onEntered, onEntering, onExit, onExited, onExiting });
    const previousInRef = useRef(inProp);
    const previousMountedRef = useRef(state.mounted);
    const previousStatusRef = useRef(state.status);
    const rafRef = useRef<null | number>(null);
    const transitionTimeoutRef = useRef<null | number>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const reducedMotion = useReducedMotion();
    const effectiveDuration = reducedMotion ? 0 : duration;
    const sizeProperty = dimension === 'height' ? 'height' : 'width';

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

    const setWrapperRef = useCallback(
      (node: HTMLDivElement | null) => {
        wrapperRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const handleTransitionEnd = useCallback(
      (event: TransitionEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget || event.propertyName !== sizeProperty) {
          return;
        }
        if (state.status === 'opening' || state.status === 'closing') {
          dispatch({ type: 'ANIMATION_END' });
        }
      },
      [sizeProperty, state.status],
    );

    useLayoutEffect(() => {
      if (inProp) {
        return;
      }
      const element = wrapperRef.current;
      if (!element) {
        return;
      }
      setMeasuredSize(dimension === 'height' ? element.offsetHeight : element.offsetWidth);
    }, [dimension, inProp]);

    useEffect(() => {
      const previous = previousInRef.current;
      previousInRef.current = inProp;
      if (inProp === previous) {
        return;
      }
      if (inProp) {
        callbacksRef.current.onEnter?.();
        dispatch({ type: 'OPEN' });
      } else {
        callbacksRef.current.onExit?.();
        dispatch({ type: 'CLOSE' });
      }
    }, [inProp]);

    useEffect(() => {
      if (!inProp && state.mounted && state.status === 'closed') {
        clearAnimationFrame();
        dispatch({ type: 'UNMOUNT' });
      }
    }, [clearAnimationFrame, inProp, state.mounted, state.status]);

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

    useLayoutEffect(() => {
      if (state.status !== 'opening') {
        return;
      }
      const element = wrapperRef.current;
      if (!element) {
        return;
      }
      const size = dimension === 'height' ? element.scrollHeight : element.scrollWidth;
      setMeasuredSize(size);
    }, [dimension, state.status]);

    useEffect(() => {
      if (state.status !== 'closing' || effectiveDuration === 0) {
        return;
      }
      const element = wrapperRef.current;
      if (!element || measuredSize === null) {
        return;
      }
      clearAnimationFrame();
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          if (element) {
            element.style[sizeProperty] = '0px';
          }
          rafRef.current = null;
        });
      });
    }, [clearAnimationFrame, effectiveDuration, measuredSize, sizeProperty, state.status]);

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

    useEffect(
      () => () => {
        clearAnimationFrame();
        clearTransitionTimeout();
      },
      [clearAnimationFrame, clearTransitionTimeout],
    );

    const baseStyle = useMemo<CollapseCssProperties>(
      () => ({ '--rbs-collapse-duration': `${effectiveDuration}ms` }),
      [effectiveDuration],
    );

    const transitionStyle = useMemo(() => {
      if (state.status === 'closed') {
        return dimension === 'height' ? { height: '0px' } : { width: '0px' };
      }
      if (state.status === 'opening') {
        const value = measuredSize === null ? '0px' : `${measuredSize}px`;
        return dimension === 'height' ? { height: value } : { width: value };
      }
      if (state.status === 'closing' && measuredSize !== null) {
        const value = `${measuredSize}px`;
        return dimension === 'height' ? { height: value } : { width: value };
      }
      return {};
    }, [dimension, measuredSize, state.status]);

    const mergedStyle = useMemo(
      () => ({ ...style, ...baseStyle, ...transitionStyle }),
      [baseStyle, style, transitionStyle],
    );

    if (!state.mounted) {
      return null;
    }

    return (
      <div
        className={clsx(
          'collapse',
          styles.collapse,
          effectiveDuration === 0 && styles.collapseReducedMotion,
          className,
        )}
        data-dimension={dimension}
        data-status={state.status}
        onTransitionEnd={handleTransitionEnd}
        ref={setWrapperRef}
        style={mergedStyle}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Collapse.displayName = 'Collapse';

export default Collapse;
