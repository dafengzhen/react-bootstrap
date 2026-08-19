```typescript
export interface ModalDialogProps extends HTMLAttributes<HTMLDivElement> {
  centered?: boolean;
  children?: ReactNode;
  className?: string;
  fullscreen?: ModalFullscreen;
  scrollable?: boolean;
  size?: ModalSize;
}

export interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  closeButton?: boolean;
  closeLabel?: string;
}

export interface ModalTitleProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface ModalDescriptionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface ModalCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}
```
