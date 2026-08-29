import { forwardRef } from 'react';

import type { TypographyLinkProps } from './types';

import { TypographyBase } from './typography-base';

export const TypographyLink = forwardRef<HTMLElement, TypographyLinkProps>((props, ref) => (
  <TypographyBase element="a" ref={ref} {...props} />
));

TypographyLink.displayName = 'TypographyLink';

export default TypographyLink;
