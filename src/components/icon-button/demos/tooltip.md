```tsx
<div className="d-flex flex-wrap gap-2">
  <TooltipTrigger placement="top" title="搜索">
    <IconButton label="搜索" variant="outline-primary">
      <Search size={18} />
    </IconButton>
  </TooltipTrigger>
  <TooltipTrigger placement="top" title="编辑">
    <IconButton label="编辑" variant="outline-secondary">
      <PenLine size={18} />
    </IconButton>
  </TooltipTrigger>
  <TooltipTrigger placement="top" title="分享">
    <IconButton label="分享" variant="outline-success">
      <Share2 size={18} />
    </IconButton>
  </TooltipTrigger>
</div>
```
