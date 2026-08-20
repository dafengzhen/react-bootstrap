```tsx
<div className="d-flex flex-wrap gap-2">
  <TooltipTrigger offset={[0, 12]} placement="top" title="额外偏移 12px">
    <Button variant="secondary">偏移 12</Button>
  </TooltipTrigger>
  <TooltipTrigger flip={false} placement="top" title="禁止翻转">
    <Button variant="secondary">禁止翻转</Button>
  </TooltipTrigger>
  <TooltipTrigger padding={48} placement="top" title="视口留白 48px">
    <Button variant="secondary">视口留白</Button>
  </TooltipTrigger>
</div>
```
