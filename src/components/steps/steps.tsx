import clsx from 'clsx';
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useMemo,
  useState,
} from 'react';

import type { StepsContextValue, StepsItemProps, StepsProps } from './types';

import { StepsContext } from './steps-context';
import { StepsItem } from './steps-item';
import styles from './steps.module.css';

export const Steps = forwardRef<HTMLElement, StepsProps>(
  (
    {
      active,
      as: Component = 'ol',
      center = false,
      children,
      className,
      clickable = true,
      defaultActive = 0,
      direction = 'horizontal',
      onChange,
      variant = 'default',
      ...rest
    },
    ref,
  ) => {
    const [internalActive, setInternalActive] = useState(defaultActive);
    const currentActive = active ?? internalActive;

    const handleSelect = useCallback(
      (index: number) => {
        if (index === currentActive) {
          return;
        }
        onChange?.(index);
        if (active == null) {
          setInternalActive(index);
        }
      },
      [active, currentActive, onChange],
    );

    const contextValue = useMemo<StepsContextValue>(
      () => ({
        active: currentActive,
        clickable,
        direction,
        handleSelect,
        variant,
      }),
      [clickable, currentActive, direction, handleSelect, variant],
    );

    const items = Children.map(children, (child, index) => {
      if (!isValidElement<StepsItemProps>(child) || child.type !== StepsItem) {
        return null;
      }
      return cloneElement(child, { index });
    });

    return (
      <StepsContext.Provider value={contextValue}>
        <Component
          className={clsx(
            styles.steps,
            styles[direction],
            center && styles.center,
            variant === 'dots' && styles.dots,
            clickable && styles.clickable,
            className,
          )}
          ref={ref}
          {...rest}
        >
          {items}
        </Component>
      </StepsContext.Provider>
    );
  },
);

Steps.displayName = 'Steps';

export default Steps;
