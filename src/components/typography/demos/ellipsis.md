```tsx
<div className="d-flex flex-column gap-3">
  <TypographyText ellipsis style={{ maxWidth: 280 }}>
    这是一段很长的文本，超出一行时会被截断并以省略号结尾。
  </TypographyText>
  <TypographyText ellipsis={{ tooltip: true }} style={{ maxWidth: 280 }}>
    开启 tooltip 后，鼠标悬停在文本上可以查看完整内容。
  </TypographyText>
</div>
```
