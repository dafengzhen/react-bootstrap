```tsx
<PopoverTrigger content="禁用按钮的弹窗内容" title="弹窗标题">
  {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
  <span className="d-inline-block" tabIndex={0}>
    <Button disabled style={{ pointerEvents: 'none' }} variant="primary">
      禁用按钮
    </Button>
  </span>
</PopoverTrigger>
```
