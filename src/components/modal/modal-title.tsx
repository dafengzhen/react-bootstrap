import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ModalTitleProps } from './types';

import { useModal } from './context';

export const ModalTitle = forwardRef<HTMLElement, ModalTitleProps>(
  ({ as: Component = 'h5', children, className, id, ...rest }, ref) => {
    const { titleId } = useModal();
    return (
      <Component className={clsx('modal-title', className)} id={id || titleId} ref={ref} {...rest}>
        {children}
      </Component>
    );
  },
);

ModalTitle.displayName = 'ModalTitle';

export default ModalTitle;
