```tsx
<TypographyParagraph
  ellipsis={{
    expandable: true,
    rows: 2,
    symbol: (expanded) => (expanded ? '收起' : '展开'),
    tooltip: true,
  }}
  style={{ maxWidth: 420 }}
>
  Bootstrap 由 Twitter 的 Mark Otto 和 Jacob Thornton 开发，最初命名为 Twitter Blueprint，后来在
  2011 年 8 月作为开源项目发布。它提供了一系列 CSS 类与 JavaScript
  插件，用于快速构建响应式、移动优先的网页界面，是全球最流行的前端框架之一。
</TypographyParagraph>
```
