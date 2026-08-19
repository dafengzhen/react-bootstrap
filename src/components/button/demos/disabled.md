```tsx
<div className="d-flex flex-wrap gap-2">
  <Button disabled variant="primary">
    禁用按钮
  </Button>
  <Button disabled variant="outline-danger">
    禁用轮廓按钮
  </Button>
  <Button as="a" disabled href="#" role="button" variant="primary">
    禁用链接
  </Button>
  <Button as="a" disabled role="button" variant="secondary">
    无 href 的禁用链接
  </Button>
</div>
```
