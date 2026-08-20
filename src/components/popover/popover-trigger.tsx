import clsx from 'clsx';
import {
  cloneElement,
  type FocusEvent,
  type HTMLAttributes,
  isValidElement,
  type MouseEvent,
  type ReactElement,
  type Ref,
  type RefAttributes,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import type { PopoverTriggerProps, PopoverTriggerType } from './types';

import { useReducedMotion } from '../../hooks';
import { transitionReducer } from '../../stores';
import { type Placement, positionElement, resetPosition } from '../../utils';
import {
  DEFAULT_OFFSET,
  DEFAULT_PADDING,
  DEFAULT_PLACEMENT,
  DEFAULT_TRIGGERS,
  FADE_DURATION,
  OPEN_ANIMATION_START_FALLBACK,
  TRANSITION_END_BUFFER,
} from './constants';
import { Popover } from './popover';

const POPOVER_ARROW_SELECTOR = '.popover-arrow';

type PopoverChildProps = HTMLAttributes<HTMLElement> & RefAttributes<HTMLElement>;

interface PopoverOverlayProps {
  className?: string;
  id?: string;
  placement?: Placement;
  ref?: Ref<HTMLElement>;
  show?: boolean;
}

export const PopoverTrigger = ({
  animation = true,
  children,
  content,
  customClass,
  defaultShow = false,
  delay = 0,
  disabled = false,
  flip = true,
  id,
  offset = DEFAULT_OFFSET,
  onToggle,
  overlay,
  padding = DEFAULT_PADDING,
  placement = DEFAULT_PLACEMENT,
  show: showProp,
  title,
  trigger = DEFAULT_TRIGGERS,
}: PopoverTriggerProps) => {
  const generatedId = useId();
  const reducedMotion = useReducedMotion();

  const initialShow = showProp ?? defaultShow;
  const [showState, setShowState] = useState(defaultShow);
  const [transition, dispatch] = useReducer(transitionReducer, {
    mounted: initialShow,
    status: initialShow ? 'opened' : 'closed',
  });
  const [popoverElement, setPopoverElement] = useState<HTMLElement | null>(null);
  const [currentPlacement, setCurrentPlacement] = useState(placement);

  const triggerElementRef = useRef<HTMLElement | null>(null);
  const showTimerRef = useRef<null | number>(null);
  const hideTimerRef = useRef<null | number>(null);
  const rafRef = useRef<null | number>(null);
  const transitionTimeoutRef = useRef<null | number>(null);

  const childElement = children as ReactElement<PopoverChildProps>;
  const overlayElement = overlay as ReactElement<PopoverOverlayProps> | undefined;
  const childElementRef = useRef(childElement);
  // oxlint-disable-next-line react/refs
  childElementRef.current = childElement;
  const overlayElementRef = useRef(overlayElement);
  // oxlint-disable-next-line react/refs
  overlayElementRef.current = overlayElement;

  if (!isValidElement(children)) {
    throw new Error('PopoverTrigger 的 children 必须是单个 React 元素');
  }

  const hasOverlay = overlayElement != null;
  const hasTitle = title != null && title !== '';
  const hasContent = content != null && content !== '';
  const canShow = hasOverlay || hasTitle || hasContent;
  const show = canShow && (showProp ?? showState);
  const visible = show && !disabled;

  const popoverId = id ?? overlayElement?.props.id ?? generatedId;

  const delayShow = typeof delay === 'number' ? delay : (delay.show ?? 0);
  const delayHide = typeof delay === 'number' ? delay : (delay.hide ?? 0);
  const shouldAnimate = animation && !reducedMotion;
  const effectiveDuration = shouldAnimate ? FADE_DURATION : 0;

  const handleToggle = useCallback(
    (nextShow: boolean) => {
      onToggle?.(nextShow);
      if (showProp === undefined) {
        setShowState(nextShow);
      }
    },
    [onToggle, showProp],
  );

  const clearShowTimer = useCallback(() => {
    if (showTimerRef.current !== null) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

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

  const handleDelayedShow = useCallback(() => {
    clearHideTimer();
    if (delayShow === 0) {
      clearShowTimer();
      handleToggle(true);
      return;
    }
    if (showTimerRef.current !== null) {
      return;
    }
    showTimerRef.current = window.setTimeout(() => {
      showTimerRef.current = null;
      handleToggle(true);
    }, delayShow);
  }, [clearHideTimer, clearShowTimer, delayShow, handleToggle]);

  const handleDelayedHide = useCallback(() => {
    clearShowTimer();
    clearHideTimer();
    if (delayHide === 0) {
      handleToggle(false);
      return;
    }
    hideTimerRef.current = window.setTimeout(() => {
      hideTimerRef.current = null;
      handleToggle(false);
    }, delayHide);
  }, [clearHideTimer, clearShowTimer, delayHide, handleToggle]);

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

  useEffect(() => {
    if (visible) {
      if (!transition.mounted || transition.status === 'closing') {
        dispatch({ type: 'OPEN' });
      }
      return;
    }
    if (!transition.mounted) {
      return;
    }
    if (transition.status === 'closed') {
      dispatch({ type: 'UNMOUNT' });
    } else {
      dispatch({ type: 'CLOSE' });
    }
  }, [transition.mounted, transition.status, visible]);

  useEffect(() => {
    if (transition.status === 'closed' && transition.mounted) {
      if (effectiveDuration === 0) {
        dispatch({ type: 'INSTANT_OPEN' });
      } else {
        scheduleOpenAnimation();
        transitionTimeoutRef.current = window.setTimeout(() => {
          transitionTimeoutRef.current = null;
          dispatch({ type: 'ANIMATION_START' });
        }, OPEN_ANIMATION_START_FALLBACK);
      }
    } else if (transition.status === 'opening' && effectiveDuration === 0) {
      dispatch({ type: 'ANIMATION_END' });
    } else if (transition.status === 'closing' && effectiveDuration === 0) {
      dispatch({ type: 'ANIMATION_END' });
    }

    if (
      (transition.status === 'opening' || transition.status === 'closing') &&
      effectiveDuration > 0
    ) {
      transitionTimeoutRef.current = window.setTimeout(() => {
        dispatch({ type: 'ANIMATION_END' });
        transitionTimeoutRef.current = null;
      }, effectiveDuration + TRANSITION_END_BUFFER);
    }

    return clearTransitionTimeout;
  }, [
    clearTransitionTimeout,
    effectiveDuration,
    scheduleOpenAnimation,
    transition.mounted,
    transition.status,
  ]);

  useEffect(() => {
    if (!transition.mounted || !popoverElement) {
      return;
    }
    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== popoverElement || event.propertyName !== 'opacity') {
        return;
      }
      dispatch({ type: 'ANIMATION_END' });
    };
    popoverElement.addEventListener('transitionend', handleTransitionEnd);
    return () => popoverElement.removeEventListener('transitionend', handleTransitionEnd);
  }, [popoverElement, transition.mounted]);

  useEffect(() => {
    if (!transition.mounted) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleToggle(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleToggle, transition.mounted]);

  useEffect(
    () => () => {
      clearAnimationFrame();
      clearHideTimer();
      clearShowTimer();
      clearTransitionTimeout();
    },
    [clearAnimationFrame, clearHideTimer, clearShowTimer, clearTransitionTimeout],
  );

  useLayoutEffect(() => {
    const triggerElement = triggerElementRef.current;
    if (!transition.mounted || !popoverElement || !triggerElement) {
      return;
    }

    const applyPosition = () => {
      const nextPlacement = positionElement(popoverElement, triggerElement, {
        arrowSelector: POPOVER_ARROW_SELECTOR,
        flip,
        offset,
        padding,
        placement,
      });
      setCurrentPlacement(nextPlacement);
    };

    applyPosition();

    window.addEventListener('resize', applyPosition);
    window.addEventListener('scroll', applyPosition, true);
    const resizeObserver = new ResizeObserver(applyPosition);
    resizeObserver.observe(popoverElement);
    resizeObserver.observe(triggerElement);

    return () => {
      window.removeEventListener('resize', applyPosition);
      window.removeEventListener('scroll', applyPosition, true);
      resizeObserver.disconnect();
      resetPosition(popoverElement, POPOVER_ARROW_SELECTOR);
    };
  }, [flip, offset, padding, placement, popoverElement, transition.mounted]);

  const triggerList = useMemo<PopoverTriggerType[]>(
    () => (Array.isArray(trigger) ? trigger : [trigger]),
    [trigger],
  );

  const setTriggerElement = useCallback((element: HTMLElement | null) => {
    triggerElementRef.current = element;
    const ref = childElementRef.current.props.ref;
    if (ref == null) {
      return;
    }
    if (typeof ref === 'function') {
      ref(element);
    } else {
      ref.current = element;
    }
  }, []);

  const setPopoverElementCallback = useCallback((element: HTMLElement | null) => {
    setPopoverElement(element);
    const ref = overlayElementRef.current?.props.ref;
    if (ref == null) {
      return;
    }
    if (typeof ref === 'function') {
      ref(element);
    } else {
      ref.current = element;
    }
  }, []);

  const triggerProps: HTMLAttributes<HTMLElement> = {};

  if (transition.mounted) {
    triggerProps['aria-describedby'] = popoverId;
  }

  if (!disabled) {
    const childOnClick = childElement.props.onClick;
    const childOnFocus = childElement.props.onFocus;
    const childOnBlur = childElement.props.onBlur;
    const childOnMouseEnter = childElement.props.onMouseEnter;
    const childOnMouseLeave = childElement.props.onMouseLeave;

    if (triggerList.includes('click')) {
      triggerProps.onClick = (event: MouseEvent<HTMLElement>) => {
        handleToggle(!show);
        childOnClick?.(event);
      };
    }
    if (triggerList.includes('focus')) {
      triggerProps.onFocus = (event: FocusEvent<HTMLElement>) => {
        handleDelayedShow();
        childOnFocus?.(event);
      };
      triggerProps.onBlur = (event: FocusEvent<HTMLElement>) => {
        handleDelayedHide();
        childOnBlur?.(event);
      };
    }
    if (triggerList.includes('hover')) {
      triggerProps.onMouseEnter = (event: MouseEvent<HTMLElement>) => {
        handleDelayedShow();
        childOnMouseEnter?.(event);
      };
      triggerProps.onMouseLeave = (event: MouseEvent<HTMLElement>) => {
        handleDelayedHide();
        childOnMouseLeave?.(event);
      };
    }
  }

  const isShown = transition.status === 'opening' || transition.status === 'opened';

  let popoverNode: null | ReactElement = null;

  if (transition.mounted && overlayElement) {
    // oxlint-disable-next-line react/refs
    popoverNode = cloneElement(overlayElement, {
      className: clsx(overlayElement.props.className, customClass),
      id: popoverId,
      placement: currentPlacement,
      ref: setPopoverElementCallback,
      show: isShown,
    });
  } else if (transition.mounted) {
    popoverNode = (
      <Popover
        animation={shouldAnimate}
        className={customClass}
        flip={flip}
        id={popoverId}
        placement={currentPlacement}
        ref={setPopoverElementCallback}
        show={isShown}
        title={title}
      >
        {content}
      </Popover>
    );
  }

  return (
    <>
      {/* oxlint-disable-next-line react/refs */}
      {cloneElement(childElement, { ...triggerProps, ref: setTriggerElement })}
      {popoverNode}
    </>
  );
};

PopoverTrigger.displayName = 'PopoverTrigger';

export default PopoverTrigger;
