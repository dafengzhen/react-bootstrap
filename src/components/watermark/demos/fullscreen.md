```tsx
const [visible, setVisible] = useState(false);

<>
  <button className="btn btn-primary" onClick={() => setVisible((prev) => !prev)} type="button">
    {visible ? '关闭全屏水印' : '开启全屏水印'}
  </button>
  {visible && (
    <Watermark
      content="机密文件 · 请勿外传"
      fullscreen
      gap={[140, 140]}
      opacity={0.5}
      rotate={-30}
      zIndex={1030}
    />
  )}
</>;
```
