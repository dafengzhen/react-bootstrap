```tsx
<div className="d-flex flex-column gap-3">
  <Alert className="d-flex align-items-center" variant="primary">
    <Info aria-hidden="true" className="flex-shrink-0 me-2" size={16} />
    <div>主要提示示例，带有图标</div>
  </Alert>
  <Alert className="d-flex align-items-center" variant="success">
    <CircleCheck aria-hidden="true" className="flex-shrink-0 me-2" size={16} />
    <div>成功提示示例，带有图标</div>
  </Alert>
  <Alert className="d-flex align-items-center" variant="warning">
    <TriangleAlert aria-hidden="true" className="flex-shrink-0 me-2" size={16} />
    <div>警告提示示例，带有图标</div>
  </Alert>
  <Alert className="d-flex align-items-center" variant="danger">
    <TriangleAlert aria-hidden="true" className="flex-shrink-0 me-2" size={16} />
    <div>危险提示示例，带有图标</div>
  </Alert>
</div>
```
