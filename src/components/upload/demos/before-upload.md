```tsx
const [rejected, setRejected] = useState<string[]>([]);

const beforeUpload = (file: File) => {
  if (file.name.endsWith('.txt')) {
    setRejected((prev) => [...prev, file.name]);
    return false;
  }
  return true;
};

<Upload beforeUpload={beforeUpload} multiple />;

<p className="mb-0 mt-3 text-muted small">已拒绝：{rejected.join('、') || '无'}</p>;
```
