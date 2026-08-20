```tsx
<div className="d-flex flex-wrap gap-2">
  <TooltipTrigger delay={500} placement="top" title="显示与隐藏均延迟 500ms">
    <Button variant="secondary">数字延迟</Button>
  </TooltipTrigger>
  <TooltipTrigger delay={{ hide: 200, show: 500 }} placement="top" title="显示 500ms，隐藏 200ms">
    <Button variant="secondary">对象延迟</Button>
  </TooltipTrigger>
  <TooltipTrigger animation={false} placement="top" title="无淡入淡出动画">
    <Button variant="secondary">禁用动画</Button>
  </TooltipTrigger>
</div>
```
