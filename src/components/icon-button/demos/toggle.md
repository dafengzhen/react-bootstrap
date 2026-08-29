```tsx
<div className="d-flex flex-wrap gap-2">
  <IconButton label="收藏" toggle variant="outline-primary">
    <Bookmark size={18} />
  </IconButton>
  <IconButton defaultActive label="预激活" toggle variant="outline-danger">
    <Heart size={18} />
  </IconButton>
  <IconButton disabled label="禁用切换" toggle>
    <Bookmark size={18} />
  </IconButton>
  <IconButton label="点赞" toggle variant="primary">
    <ThumbsUp size={18} />
  </IconButton>
</div>
```
