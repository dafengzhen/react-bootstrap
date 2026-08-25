```typescript
export interface UploadFile {
  error?: string;
  name: string;
  percent?: number;
  raw?: File;
  size?: number;
  status?: UploadStatus;
  uid: string;
  url?: string;
}
```
