```typescript
import type { ElementType, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';

export interface MenuDividerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}
```
