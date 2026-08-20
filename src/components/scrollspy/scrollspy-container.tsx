import clsx from 'clsx';
import { forwardRef, useCallback, useLayoutEffect, useRef } from 'react';

import type { ScrollSpyContainerProps } from './types';

import { useScrollSpy } from './context';
import styles from './scrollspy.module.css';

export const ScrollSpyContainer = forwardRef<HTMLElement, ScrollSpyContainerProps>(
  ({ as: Component = 'div', children, className, style, tabIndex = 0, ...rest }, ref) => {
    const context = useScrollSpy();
    const registerContainer = context?.registerContainer;
    const innerRef = useRef<HTMLElement | null>(null);

    const setRef = useCallback(
      (node: HTMLElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    useLayoutEffect(() => {
      registerContainer?.(innerRef.current);
      return () => {
        registerContainer?.(null);
      };
    }, [registerContainer]);

    return (
      <Component
        className={clsx(styles.scrollspy, className)}
        ref={setRef}
        style={style}
        tabIndex={tabIndex}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

ScrollSpyContainer.displayName = 'ScrollSpyContainer';

export default ScrollSpyContainer;
