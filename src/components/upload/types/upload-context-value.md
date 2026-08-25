```typescript
export interface UploadContextValue {
  accept?: string;
  beforeUpload?: UploadBeforeUpload;
  disabled: boolean;
  files: UploadFile[];
  handleRemove: (file: UploadFile) => void;
  maxCount?: number;
  maxSize?: number;
  multiple: boolean;
  openFileDialog: () => void;
}
```
