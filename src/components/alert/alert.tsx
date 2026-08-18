import clsx from 'clsx';
import {
  forwardRef,
  type TransitionEvent,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

import type { AlertProps } from './types';

import { CloseButton } from '../close-button';

const TRANSITION_DURATION = 150;
const TRANSITION_END_BUFFER = 20;

type AlertAction = { type: 'HIDE_COMPLETE' | 'SHOW' };

type AlertState = { mounted: boolean };

const alertReducer = (state: AlertState, action: AlertAction): AlertState => {
  switch (action.type) {
    case 'HIDE_COMPLETE': {
      return state.mounted ? { mounted: false } : state;
    }
    case 'SHOW': {
      return state.mounted ? state : { mounted: true };
    }
  }
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      children,
      className,
      closeLabel = 'Close alert',
      closeVariant,
      dismissible = false,
      onClose,
      show,
      variant = 'primary',
      ...rest
    },
    ref,
  ) => {
    const isControlled = show !== undefined;
    const [internalShow, setInternalShow] = useState(true);
    const isShown = isControlled ? show : internalShow;

    const [state, dispatch] = useReducer(alertReducer, { mounted: isShown });
    const transitionTimeoutRef = useRef<null | number>(null);

    const clearTransitionTimeout = useCallback(() => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    }, []);

    useEffect(() => {
      clearTransitionTimeout();
      if (isShown) {
        dispatch({ type: 'SHOW' });
        return;
      }

      transitionTimeoutRef.current = window.setTimeout(() => {
        dispatch({ type: 'HIDE_COMPLETE' });
        transitionTimeoutRef.current = null;
      }, TRANSITION_DURATION + TRANSITION_END_BUFFER);
    }, [clearTransitionTimeout, isShown]);

    useEffect(() => () => clearTransitionTimeout(), [clearTransitionTimeout]);

    const handleTransitionEnd = useCallback(
      (event: TransitionEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget || event.propertyName !== 'opacity') {
          return;
        }

        if (!isShown) {
          clearTransitionTimeout();
          dispatch({ type: 'HIDE_COMPLETE' });
        }
      },
      [clearTransitionTimeout, isShown],
    );

    const handleClose = useCallback(() => {
      onClose?.();
      if (!isControlled) {
        setInternalShow(false);
      }
    }, [isControlled, onClose]);

    if (!state.mounted) {
      return null;
    }

    return (
      <div
        className={clsx(
          'alert',
          `alert-${variant}`,
          dismissible && 'alert-dismissible',
          'fade',
          isShown && 'show',
          className,
        )}
        onTransitionEnd={handleTransitionEnd}
        ref={ref}
        role="alert"
        {...rest}
      >
        {children}
        {dismissible && (
          <CloseButton
            aria-label={closeLabel}
            onClick={handleClose}
            variant={closeVariant ?? (variant === 'dark' ? 'white' : undefined)}
          />
        )}
      </div>
    );
  },
);

Alert.displayName = 'Alert';

export default Alert;
