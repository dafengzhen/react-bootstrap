```tsx
const CustomTrigger = () => {
  const upload = useUpload();

  return (
    <button
      className="btn btn-outline-primary"
      onClick={(event) => {
        event.stopPropagation();
        upload?.openFileDialog();
      }}
      type="button"
    >
      选择文件
    </button>
  );
};

<Upload>
  <CustomTrigger />
</Upload>;
```
