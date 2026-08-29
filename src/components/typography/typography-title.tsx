import { forwardRef } from 'react';

import type { TypographyTitleProps } from './types';

import { TypographyBase } from './typography-base';

export const TypographyTitle = forwardRef<HTMLElement, TypographyTitleProps>(
  ({ level = 1, ...rest }, ref) => <TypographyBase element={`h${level}`} ref={ref} {...rest} />,
);

TypographyTitle.displayName = 'TypographyTitle';

export default TypographyTitle;
