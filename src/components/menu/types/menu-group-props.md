```typescript
import type { ElementType, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';

export interface MenuGroupProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  label: ReactNode;
}
```
