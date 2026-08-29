```tsx
<div className="d-flex flex-wrap gap-2">
  <IconButton disabled label="禁用按钮" variant="primary">
    <Trash2 size={18} />
  </IconButton>
  <IconButton disabled label="禁用轮廓按钮" variant="outline-danger">
    <Trash2 size={18} />
  </IconButton>
  {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
  <IconButton as="a" disabled href="#" label="禁用链接" role="button" variant="primary">
    <Trash2 size={18} />
  </IconButton>
</div>
```
