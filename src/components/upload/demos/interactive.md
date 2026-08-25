```tsx
const [files, setFiles] = useState<UploadFile[]>([]);

const hasReadyFiles = files.some((file) => file.status === 'ready');
const isUploading = files.some((file) => file.status === 'uploading');

useEffect(() => {
  if (!isUploading) {
    return;
  }
  const timer = window.setInterval(() => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.status !== 'uploading') {
          return file;
        }
        const percent = Math.min(100, (file.percent ?? 0) + 20);
        return { ...file, percent, status: percent >= 100 ? 'success' : 'uploading' };
      }),
    );
  }, 300);
  return () => window.clearInterval(timer);
}, [isUploading]);

const handleStart = () => {
  setFiles((prev) =>
    prev.map((file) =>
      file.status === 'ready' ? { ...file, percent: 0, status: 'uploading' } : file,
    ),
  );
};

<Upload files={files} onFilesChange={setFiles} />;

<div className="d-flex gap-2 mt-3">
  <Button disabled={!hasReadyFiles || isUploading} onClick={handleStart} variant="primary">
    {isUploading ? '上传中…' : '开始上传'}
  </Button>
  <Button onClick={() => setFiles([])} variant="outline-secondary">
    清空
  </Button>
</div>;
```
