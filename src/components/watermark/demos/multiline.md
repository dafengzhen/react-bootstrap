```tsx
<Watermark
  content={['React Bootstrap', '机密文档 · 禁止外传']}
  font={{ fontSize: 16, fontWeight: 600 }}
  gap={[120, 120]}
>
  <div className="card">
    <div className="card-body">
      <h5 className="card-title">多行文本水印</h5>
      <p className="card-text mb-0">
        content 传入字符串数组时每个元素渲染为一行，配合 fontSize、fontWeight
        等字体选项可以调整水印的视觉重量。
      </p>
    </div>
  </div>
</Watermark>
```
