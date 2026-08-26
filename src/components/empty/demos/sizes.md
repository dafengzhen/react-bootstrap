```tsx
<div className="d-flex flex-wrap gap-3 justify-content-around">
  <Empty
    description="小型空状态，适合紧凑容器"
    image={<EmptyImage height={80} width={120} />}
    size="sm"
    style={{ width: 280 }}
    title="小尺寸"
  />

  <Empty
    description="默认空状态"
    image={<EmptyImage height={120} width={180} />}
    style={{ width: 280 }}
    title="默认尺寸"
  />

  <Empty
    description="大型空状态，适合整页占位"
    image={<EmptyImage height={200} width={300} />}
    size="lg"
    style={{ width: 280 }}
    title="大尺寸"
  />
</div>
```
