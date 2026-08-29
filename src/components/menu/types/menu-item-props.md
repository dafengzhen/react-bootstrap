```typescript
import type { ElementType, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';

export interface MenuItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect' | 'title'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  danger?: boolean;
  disabled?: boolean;
  eventKey?: EventKey;
  icon?: ReactNode;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  title?: string;
}
```
