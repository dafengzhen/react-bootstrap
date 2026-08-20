```typescript
export interface DropdownContextValue {
  align?: DropdownAlignOption;
  autoClose: DropdownAutoClose;
  drop: DropdownDirection;
  flip: boolean;
  focusFirstItemOnShow: 'keyboard' | boolean;
  menuElement: HTMLElement | null;
  onSelect: SelectCallback;
  popperConfig?: DropdownPositionConfig;
  renderMenuOnMount: boolean;
  setMenu: (element: HTMLElement | null) => void;
  setToggle: (element: HTMLElement | null, id?: string) => void;
  show: boolean;
  source?: DropdownToggleSource;
  toggle: ToggleCallback;
  toggleElement: HTMLElement | null;
  toggleId?: string;
}
```
