```typescript
import type { ElementType, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';

export interface MenuContextValue {
  activeKeys: EventKey[];
  inlineCollapsed: boolean;
  inlineIndent: number;
  level: number;
  mode: MenuMode;
  multiple: boolean;
  onItemSelect: (eventKey: EventKey, event: SyntheticEvent) => void;
  onOpenChange: (openKeys: EventKey[]) => void;
  openKeys: EventKey[];
  popup: boolean;
  selectable: boolean;
  theme: MenuTheme;
  trigger: MenuTrigger;
}
```
