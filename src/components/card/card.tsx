import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CardProps } from './types';

import CardBody from './card-body';

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ bg, body = false, border, children, className, text, ...rest }, ref) => (
    <div
      className={clsx(
        'card',
        bg && `bg-${bg}`,
        border && `border-${border}`,
        text && `text-${text}`,
        className,
      )}
      ref={ref}
      {...rest}
    >
      {body ? <CardBody>{children}</CardBody> : children}
    </div>
  ),
);

Card.displayName = 'Card';

export default Card;
