```typescript
interface SidebarContextValue {
  breakpoint: null | SidebarBreakpoint;
  collapsed: boolean;
  collapseOnSelect: boolean;
  isMobile: boolean;
  mobileOpen: boolean;
  onItemSelect?: () => void;
  placement: SidebarPlacement;
  setMobileOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
  variant: SidebarVariant;
}
```
