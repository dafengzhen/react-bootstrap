```tsx
<div className="d-flex flex-column gap-3">
  <Progress label="带标签示例" now={25}>
    25%
  </Progress>
  <Progress barProps={{ className: 'overflow-visible text-dark' }} label="长标签示例" now={10}>
    超出进度条宽度的长标签，通过 barProps 添加 overflow-visible 与 text-dark
  </Progress>
</div>
```
