import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ModalDescriptionProps } from './types';

import { useModal } from './modal-context';
import styles from './modal.module.css';

export const ModalDescription = forwardRef<HTMLElement, ModalDescriptionProps>(
  ({ as: Component = 'p', children, className, id, ...rest }, ref) => {
    const { descriptionId } = useModal();
    return (
      <Component
        className={clsx('mb-0 mt-1', styles.modalDescription, className)}
        id={id || descriptionId}
        ref={ref}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

ModalDescription.displayName = 'ModalDescription';

export default ModalDescription;
