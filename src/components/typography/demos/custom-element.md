```tsx
<div className="d-flex flex-column gap-2">
  <TypographyTitle as="div">使用 div 渲染的标题</TypographyTitle>
  <TypographyText as="label">使用 label 渲染的文本</TypographyText>
  <TypographyParagraph as="blockquote">使用 blockquote 渲染的段落</TypographyParagraph>
  <TypographyLink as="button" onClick={() => console.log('clicked')}>
    使用 button 渲染的链接样式
  </TypographyLink>
</div>
```
