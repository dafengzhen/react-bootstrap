```typescript
import type { ElementType, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';

export interface MenuProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  activeKey?: EventKey | EventKey[];
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  collapsedWidth?: number;
  defaultActiveKey?: EventKey | EventKey[];
  defaultOpenKeys?: EventKey[];
  inlineCollapsed?: boolean;
  inlineIndent?: number;
  mode?: MenuMode;
  multiple?: boolean;
  onOpenChange?: (openKeys: EventKey[]) => void;
  onSelect?: (eventKey: EventKey, event: SyntheticEvent) => void;
  openKeys?: EventKey[];
  selectable?: boolean;
  theme?: MenuTheme;
  trigger?: MenuTrigger;
}
```
