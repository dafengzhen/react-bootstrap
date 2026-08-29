```tsx
<div className="d-flex flex-column gap-3">
  <div>
    <TypographyText editable={{ onChange: (value) => console.log(value) }}>
      点击这段文本开始编辑
    </TypographyText>
  </div>
  <TypographyParagraph
    editable={{
      autoSize: { maxRows: 4, minRows: 1 },
      onChange: (value) => console.log(value),
    }}
  >
    段落也支持编辑，编辑时渲染为 textarea，按 Esc 取消、失焦保存。
  </TypographyParagraph>
</div>
```
