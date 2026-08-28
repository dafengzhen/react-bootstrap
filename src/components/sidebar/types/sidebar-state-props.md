```typescript
interface SidebarStateProps {
  breakpoint?: null | SidebarBreakpoint;
  collapsed?: boolean;
  collapseOnSelect?: boolean;
  defaultCollapsed?: boolean;
  defaultOpen?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onItemSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  placement?: SidebarPlacement;
  variant?: SidebarVariant;
}
```
