```tsx
<div className="d-flex flex-wrap gap-2">
  <PopoverTrigger content="显示与隐藏均延迟 500ms" delay={500} title="延迟">
    <Button variant="secondary">数字延迟</Button>
  </PopoverTrigger>
  <PopoverTrigger content="显示 500ms，隐藏 200ms" delay={{ hide: 200, show: 500 }} title="延迟">
    <Button variant="secondary">对象延迟</Button>
  </PopoverTrigger>
  <PopoverTrigger animation={false} content="无淡入淡出动画" title="动画">
    <Button variant="secondary">禁用动画</Button>
  </PopoverTrigger>
</div>
```
