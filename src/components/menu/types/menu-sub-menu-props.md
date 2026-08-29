```typescript
import type { ElementType, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';

export interface MenuSubMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect' | 'title'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  eventKey?: EventKey;
  icon?: ReactNode;
  title: ReactNode;
}
```
