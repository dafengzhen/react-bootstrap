```tsx
const [files, setFiles] = useState<UploadFile[]>([]);

const handleRemove = (file: UploadFile) => {
  setFiles((prev) => prev.filter((item) => item.uid !== file.uid));
};

<Upload onFilesChange={setFiles} showUploadList={false}>
  <span className="btn btn-secondary">选择文件</span>
</Upload>;

<UploadList className="mt-2">
  {files.map((file) => (
    <UploadItem file={file} key={file.uid} onRemove={handleRemove} />
  ))}
</UploadList>;
```
