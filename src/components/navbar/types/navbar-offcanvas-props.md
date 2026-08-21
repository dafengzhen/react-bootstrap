```typescript
export interface NavbarOffcanvasProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onHide'> {
  backdrop?: boolean | 'static';
  children?: ReactNode;
  className?: string;
  duration?: number;
  keyboard?: boolean;
  onEnter?: () => void;
  onEntered?: () => void;
  onEntering?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  onExiting?: () => void;
  onHide?: () => void;
  placement?: NavbarOffcanvasPlacement;
  scroll?: boolean;
}
```
