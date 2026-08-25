```typescript
export interface UploadItemProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  file: UploadFile;
  onRemove?: (file: UploadFile) => void;
}
```
