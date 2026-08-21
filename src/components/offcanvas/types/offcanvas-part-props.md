```typescript
export interface OffcanvasHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  closeButton?: boolean;
  closeLabel?: string;
}

export interface OffcanvasTitleProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface OffcanvasBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface OffcanvasCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}
```
