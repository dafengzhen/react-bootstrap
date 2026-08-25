```typescript
export interface UploadProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  accept?: string;
  as?: ElementType;
  beforeUpload?: UploadBeforeUpload;
  capture?: boolean | 'environment' | 'user';
  children?: ReactNode;
  className?: string;
  defaultFiles?: UploadFile[];
  disabled?: boolean;
  dropzone?: boolean;
  files?: UploadFile[];
  itemProps?: Omit<UploadItemProps, 'file'>;
  listProps?: Omit<UploadListProps, 'children'>;
  maxCount?: number;
  maxSize?: number;
  multiple?: boolean;
  name?: string;
  onFilesChange?: (files: UploadFile[]) => void;
  showUploadList?: boolean;
}
```
