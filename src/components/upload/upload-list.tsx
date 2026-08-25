import clsx from 'clsx';
import { forwardRef } from 'react';

import type { UploadListProps } from './types';

import styles from './upload.module.css';

export const UploadList = forwardRef<HTMLElement, UploadListProps>(
  ({ as: Component = 'ul', children, className, ...rest }, ref) => (
    <Component className={clsx(styles.list, className)} ref={ref} {...rest}>
      {children}
    </Component>
  ),
);

UploadList.displayName = 'UploadList';

export default UploadList;
