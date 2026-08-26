import clsx from 'clsx';
import { forwardRef } from 'react';

import type { EmptyProps } from './types';

import styles from './empty.module.css';

export const Empty = forwardRef<HTMLElement, EmptyProps>(
  (
    { as: Component = 'div', children, className, description, image, size = 'md', title, ...rest },
    ref,
  ) => (
    <Component className={clsx(styles.empty, styles[size], className)} ref={ref} {...rest}>
      {image != null && <div className={styles.image}>{image}</div>}
      {title != null && <div className={styles.title}>{title}</div>}
      {description != null && <div className={styles.description}>{description}</div>}
      {children != null && <div className={styles.actions}>{children}</div>}
    </Component>
  ),
);

Empty.displayName = 'Empty';

export default Empty;
