```typescript
interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>, SidebarStateProps {
  as?: ElementType;
  collapsedWidth?: number | string;
  width?: number | string;
}
```
