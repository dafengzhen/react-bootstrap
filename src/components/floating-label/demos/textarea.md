```tsx
<div className="d-flex flex-column gap-3">
  <FloatingLabel controlId="floatingTextarea" label="评论">
    <FormControl as="textarea" placeholder="在此留言" />
  </FloatingLabel>
  <FloatingLabel controlId="floatingTextarea2" label="自定义高度的评论">
    <FormControl as="textarea" placeholder="在此留言" style={{ height: 100 }} />
  </FloatingLabel>
</div>
```
