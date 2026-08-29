import { forwardRef } from 'react';

import type { TypographyParagraphProps } from './types';

import { TypographyBase } from './typography-base';

export const TypographyParagraph = forwardRef<HTMLElement, TypographyParagraphProps>(
  (props, ref) => <TypographyBase element="p" multiline ref={ref} {...props} />,
);

TypographyParagraph.displayName = 'TypographyParagraph';

export default TypographyParagraph;
