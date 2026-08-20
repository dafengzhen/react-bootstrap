```tsx
<div className="d-flex flex-wrap gap-2">
  <PopoverTrigger content="额外偏移 12px" offset={[0, 12]} placement="top" title="偏移">
    <Button variant="secondary">偏移 12</Button>
  </PopoverTrigger>
  <PopoverTrigger content="禁止翻转" flip={false} placement="top" title="翻转">
    <Button variant="secondary">禁止翻转</Button>
  </PopoverTrigger>
  <PopoverTrigger content="视口留白 48px" padding={48} placement="top" title="留白">
    <Button variant="secondary">视口留白</Button>
  </PopoverTrigger>
</div>
```
