import clsx from 'clsx';
import { forwardRef } from 'react';

import type { KbdProps } from './types';

import styles from './kbd.module.css';

export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ as: Component = 'kbd', children, className, ...rest }, ref) => (
    <Component className={clsx(styles.kbd, className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

Kbd.displayName = 'Kbd';

export default Kbd;
