```tsx
<div className="d-flex flex-wrap gap-2">
  {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
  <IconButton href="#" label="首页" role="button" variant="primary">
    <House size={18} />
  </IconButton>
  <IconButton href="#" label="外部链接" target="_blank" variant="outline-primary">
    <ExternalLink size={18} />
  </IconButton>
  <IconButton download="guide.pdf" href="/guide.pdf" label="下载指南" variant="success">
    <Download size={18} />
  </IconButton>
</div>
```
