import clsx from 'clsx';
import { forwardRef } from 'react';

import type { CardImgProps } from './types';

export const CardImg = forwardRef<HTMLImageElement, CardImgProps>(
  ({ alt = '', className, variant, ...rest }, ref) => (
    <img
      alt={alt}
      className={clsx(variant ? `card-img-${variant}` : 'card-img', className)}
      ref={ref}
      {...rest}
    />
  ),
);

CardImg.displayName = 'CardImg';

export default CardImg;
