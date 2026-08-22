import clsx from 'clsx';
import {
  type FocusEvent,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import type {
  CarouselContextValue,
  CarouselCssProperties,
  CarouselDirection,
  CarouselProps,
} from './types';

import { useReducedMotion } from '../../hooks';
import { carouselTransitionReducer } from '../../stores';
import {
  DEFAULT_DURATION,
  DEFAULT_INTERVAL,
  SWIPE_THRESHOLD,
  TRANSITION_END_BUFFER,
} from './carousel-constants';
import { CarouselContext } from './carousel-context';
import styles from './carousel.module.css';

const isFormField = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'SELECT' ||
    target.tagName === 'TEXTAREA'
  );
};

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      activeIndex: controlledActiveIndex,
      'aria-roledescription': ariaRoledescription = 'carousel',
      children,
      className,
      defaultActiveIndex = 0,
      duration = DEFAULT_DURATION,
      fade = false,
      interval = DEFAULT_INTERVAL,
      keyboard = true,
      onBlur,
      onFocus,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      onPointerCancel,
      onPointerDown,
      onPointerUp,
      onSelect,
      onSlid,
      onSlide,
      pause = 'hover',
      ride = false,
      role = 'region',
      slide = true,
      style,
      touch = true,
      wrap = true,
      ...rest
    },
    ref,
  ) => {
    const isControlled = controlledActiveIndex !== undefined;

    const [state, dispatch] = useReducer(carouselTransitionReducer, {
      activeIndex: Math.max(0, Math.trunc(controlledActiveIndex ?? defaultActiveIndex)),
      direction: null,
      pendingIndex: null,
      status: 'idle',
    });

    const [autoPlayOverride, setAutoPlayOverride] = useState<boolean | null>(null);
    const [documentHidden, setDocumentHidden] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [interacted, setInteracted] = useState(false);
    const [itemCount, setItemCount] = useState(0);

    const callbacksRef = useRef({ onSelect, onSlid, onSlide });
    const itemIntervalsRef = useRef<Map<number, number>>(new Map());
    const lastDirectionRef = useRef<CarouselDirection>('next');
    const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
    const previousActiveIndexRef = useRef(state.activeIndex);
    const previousStatusRef = useRef(state.status);
    const requestRef = useRef<{ direction: CarouselDirection; index: number } | null>(null);

    const reducedMotion = useReducedMotion();
    const animated = slide && !reducedMotion && duration > 0;
    const effectiveDuration = animated ? duration : 0;

    const autoPlayRequested =
      autoPlayOverride ?? (ride === 'carousel' || (ride === true && interacted));
    const paused = documentHidden || (pause === 'hover' && (focused || hovering));
    const autoPlaying = autoPlayRequested && itemCount > 1;

    useEffect(() => {
      callbacksRef.current = { onSelect, onSlid, onSlide };
    });

    const registerItemInterval = useCallback((index: number, value: number | undefined) => {
      if (value === undefined) {
        itemIntervalsRef.current.delete(index);
        return;
      }
      itemIntervalsRef.current.set(index, value);
    }, []);

    const resolveIndex = useCallback(
      (index: number): null | number => {
        if (itemCount <= 0 || !Number.isFinite(index)) {
          return null;
        }
        const target = Math.trunc(index);
        if (target >= 0 && target < itemCount) {
          return target;
        }
        if (!wrap) {
          return null;
        }
        return ((target % itemCount) + itemCount) % itemCount;
      },
      [itemCount, wrap],
    );

    const startSlide = useCallback(
      (target: number, direction: CarouselDirection) => {
        lastDirectionRef.current = direction;
        if (animated) {
          dispatch({ direction, index: target, type: 'SLIDE_REQUEST' });
          return;
        }
        callbacksRef.current.onSlide?.(target, direction);
        dispatch({ index: target, type: 'SLIDE_INSTANT' });
      },
      [animated],
    );

    const goTo = useCallback(
      (index: number, direction?: CarouselDirection) => {
        const target = resolveIndex(index);
        if (target === null || state.status !== 'idle' || target === state.activeIndex) {
          return;
        }
        const nextDirection = direction ?? (target > state.activeIndex ? 'next' : 'prev');
        setInteracted(true);
        requestRef.current = { direction: nextDirection, index: target };
        callbacksRef.current.onSelect?.(target, nextDirection);
        if (isControlled) {
          return;
        }
        startSlide(target, nextDirection);
      },
      [isControlled, resolveIndex, startSlide, state.activeIndex, state.status],
    );

    const next = useCallback(() => {
      goTo(state.activeIndex + 1, 'next');
    }, [goTo, state.activeIndex]);

    const prev = useCallback(() => {
      goTo(state.activeIndex - 1, 'prev');
    }, [goTo, state.activeIndex]);

    const pauseAutoPlay = useCallback(() => {
      setAutoPlayOverride(false);
    }, []);

    const playAutoPlay = useCallback(() => {
      setAutoPlayOverride(true);
    }, []);

    const notifySlideEnd = useCallback(() => {
      dispatch({ type: 'SLIDE_END' });
    }, []);

    useEffect(() => {
      if (!isControlled || controlledActiveIndex === undefined || state.status !== 'idle') {
        return;
      }
      const target = resolveIndex(controlledActiveIndex);
      if (target === null || target === state.activeIndex) {
        requestRef.current = null;
        return;
      }
      const requested = requestRef.current;
      requestRef.current = null;
      let direction: CarouselDirection = target > state.activeIndex ? 'next' : 'prev';
      if (requested?.index === target) {
        direction = requested.direction;
      }
      startSlide(target, direction);
    }, [
      controlledActiveIndex,
      isControlled,
      resolveIndex,
      startSlide,
      state.activeIndex,
      state.status,
    ]);

    useEffect(() => {
      if (itemCount <= 0) {
        return;
      }
      const maxIndex = itemCount - 1;
      const pendingIsValid = state.pendingIndex === null || state.pendingIndex <= maxIndex;
      if (state.activeIndex <= maxIndex && pendingIsValid) {
        return;
      }
      dispatch({ index: Math.min(state.activeIndex, maxIndex), type: 'SLIDE_INSTANT' });
    }, [itemCount, state.activeIndex, state.pendingIndex]);

    useEffect(() => {
      if (state.status !== 'prepared') {
        return;
      }
      if (!animated) {
        dispatch({ type: 'SLIDE_END' });
        return;
      }
      let frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          dispatch({ type: 'SLIDE_START' });
        });
      });
      return () => {
        cancelAnimationFrame(frame);
      };
    }, [animated, state.status]);

    useEffect(() => {
      if (state.status !== 'sliding') {
        return;
      }
      if (!animated) {
        dispatch({ type: 'SLIDE_END' });
        return;
      }
      const timer = window.setTimeout(() => {
        dispatch({ type: 'SLIDE_END' });
      }, effectiveDuration + TRANSITION_END_BUFFER);
      return () => {
        window.clearTimeout(timer);
      };
    }, [animated, effectiveDuration, state.status]);

    useEffect(() => {
      const previousStatus = previousStatusRef.current;
      previousStatusRef.current = state.status;
      if (state.status === 'prepared' && previousStatus === 'idle' && state.pendingIndex !== null) {
        callbacksRef.current.onSlide?.(state.pendingIndex, state.direction ?? 'next');
      }
    }, [state.direction, state.pendingIndex, state.status]);

    useEffect(() => {
      const previousActiveIndex = previousActiveIndexRef.current;
      previousActiveIndexRef.current = state.activeIndex;
      if (previousActiveIndex !== state.activeIndex) {
        callbacksRef.current.onSlid?.(state.activeIndex, lastDirectionRef.current);
      }
    }, [state.activeIndex]);

    useEffect(() => {
      const handleVisibilityChange = () => {
        setDocumentHidden(document.visibilityState === 'hidden');
      };
      handleVisibilityChange();
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, []);

    useEffect(() => {
      if (!autoPlaying || paused || state.status !== 'idle') {
        return;
      }
      if (!wrap && state.activeIndex >= itemCount - 1) {
        return;
      }
      const delay = itemIntervalsRef.current.get(state.activeIndex) ?? interval;
      if (delay === null || delay <= 0) {
        return;
      }
      const timer = window.setTimeout(() => {
        goTo(state.activeIndex + 1, 'next');
      }, delay);
      return () => {
        window.clearTimeout(timer);
      };
    }, [autoPlaying, goTo, interval, itemCount, paused, state.activeIndex, state.status, wrap]);

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLDivElement>) => {
        onBlur?.(event);
        if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget)) {
          return;
        }
        setFocused(false);
      },
      [onBlur],
    );

    const handleFocus = useCallback(
      (event: FocusEvent<HTMLDivElement>) => {
        onFocus?.(event);
        setFocused(true);
      },
      [onFocus],
    );

    const handleMouseEnter = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        onMouseEnter?.(event);
        setHovering(true);
      },
      [onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        onMouseLeave?.(event);
        setHovering(false);
      },
      [onMouseLeave],
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (!keyboard || event.defaultPrevented || isFormField(event.target)) {
          return;
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          prev();
          return;
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          next();
        }
      },
      [keyboard, next, onKeyDown, prev],
    );

    const handlePointerCancel = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        onPointerCancel?.(event);
        pointerStartRef.current = null;
      },
      [onPointerCancel],
    );

    const handlePointerDown = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);
        if (!touch || (event.pointerType !== 'pen' && event.pointerType !== 'touch')) {
          return;
        }
        pointerStartRef.current = { x: event.clientX, y: event.clientY };
      },
      [onPointerDown, touch],
    );

    const handlePointerUp = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        onPointerUp?.(event);
        const start = pointerStartRef.current;
        pointerStartRef.current = null;
        if (!touch || !start) {
          return;
        }
        const deltaX = event.clientX - start.x;
        const deltaY = event.clientY - start.y;
        if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) {
          return;
        }
        if (deltaX > 0) {
          prev();
          return;
        }
        next();
      },
      [next, onPointerUp, prev, touch],
    );

    const contextValue = useMemo<CarouselContextValue>(
      () => ({
        activeIndex: state.activeIndex,
        autoPlaying,
        direction: state.direction,
        duration: effectiveDuration,
        fade,
        goTo,
        itemCount,
        next,
        notifySlideEnd,
        pause: pauseAutoPlay,
        paused,
        pendingIndex: state.pendingIndex,
        play: playAutoPlay,
        prev,
        registerItemInterval,
        setItemCount,
        status: state.status,
        wrap,
      }),
      [
        autoPlaying,
        effectiveDuration,
        fade,
        goTo,
        itemCount,
        next,
        notifySlideEnd,
        paused,
        pauseAutoPlay,
        playAutoPlay,
        prev,
        registerItemInterval,
        state.activeIndex,
        state.direction,
        state.pendingIndex,
        state.status,
        wrap,
      ],
    );

    const baseStyle = useMemo<CarouselCssProperties>(
      () => ({ '--rbs-carousel-duration': `${effectiveDuration}ms` }),
      [effectiveDuration],
    );

    const mergedStyle = useMemo(() => ({ ...style, ...baseStyle }), [baseStyle, style]);

    return (
      <CarouselContext.Provider value={contextValue}>
        {/* oxlint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          aria-roledescription={ariaRoledescription}
          className={clsx(
            'carousel',
            styles.carousel,
            fade ? styles.fade : styles.slide,
            !animated && styles.reducedMotion,
            touch && styles.touch,
            className,
          )}
          data-direction={state.direction ?? undefined}
          data-status={state.status}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onPointerCancel={handlePointerCancel}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          ref={ref}
          role={role}
          style={mergedStyle}
          {...rest}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);

Carousel.displayName = 'Carousel';

export default Carousel;
