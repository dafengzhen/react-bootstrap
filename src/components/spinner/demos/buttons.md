```tsx
<div className="d-flex flex-wrap gap-2">
  <Button disabled variant="primary">
    <Spinner animation="border" aria-hidden="true" as="span" size="sm" />
    <span className="visually-hidden">加载中...</span>
  </Button>
  <Button disabled variant="primary">
    <Spinner animation="border" aria-hidden="true" as="span" size="sm" />
    <span role="status">加载中...</span>
  </Button>
  <Button disabled variant="primary">
    <Spinner animation="grow" aria-hidden="true" as="span" size="sm" />
    <span role="status">加载中...</span>
  </Button>
</div>
```
