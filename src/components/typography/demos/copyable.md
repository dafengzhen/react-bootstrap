```tsx
<div className="d-flex flex-column gap-3">
  <TypographyText copyable>点击图标复制这段文本</TypographyText>
  <TypographyParagraph
    copyable={{
      onCopy: (text) => console.log(`已复制：${text}`),
      tooltips: ['点击复制', '复制成功'],
    }}
  >
    通过配置对象自定义复制内容、提示文案与回调。
  </TypographyParagraph>
</div>
```
