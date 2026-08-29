import { forwardRef } from 'react';

import type { TypographyTextProps } from './types';

import { TypographyBase } from './typography-base';

export const TypographyText = forwardRef<HTMLElement, TypographyTextProps>((props, ref) => (
  <TypographyBase element="span" ref={ref} {...props} />
));

TypographyText.displayName = 'TypographyText';

export default TypographyText;
