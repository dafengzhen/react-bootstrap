```tsx
const [files, setFiles] = useState<UploadFile[]>([]);

const handleAdd = () => {
  setFiles((prev) => [
    ...prev,
    {
      name: `document-${prev.length + 1}.pdf`,
      size: 2048,
      status: 'ready',
      uid: `uid-${prev.length + 1}`,
    },
  ]);
};

const handleClear = () => {
  setFiles([]);
};

<Upload files={files} onFilesChange={setFiles} />;

<div className="d-flex gap-2 mt-3">
  <Button onClick={handleAdd} variant="outline-secondary">
    添加模拟文件
  </Button>
  <Button onClick={handleClear} variant="outline-secondary">
    清空列表
  </Button>
</div>;
```
