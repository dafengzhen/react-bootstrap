```typescript
export type UploadBeforeUpload = (file: File, files: UploadFile[]) => boolean | Promise<boolean>;
```
