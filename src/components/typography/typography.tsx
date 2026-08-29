import type { TypographyProps } from './types';

import { TypographyContext } from './typography-context';

export const Typography = ({ children, ...defaults }: TypographyProps) => (
  <TypographyContext.Provider value={defaults}>{children}</TypographyContext.Provider>
);

Typography.displayName = 'Typography';

export default Typography;
