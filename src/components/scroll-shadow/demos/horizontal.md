```tsx
<ScrollShadow className="border rounded-3" direction="horizontal">
  <div className="d-flex flex-nowrap gap-3 p-3">
    {Array.from({ length: 12 }, (_, index) => (
      <div className="card" key={index} style={{ minWidth: 200 }}>
        <div className="card-body">
          <h6 className="card-title mb-2">卡片 #{index + 1}</h6>
          <p className="card-text small mb-0">横向滚动容器，观察左右两端的阴影随滚动位置的变化。</p>
        </div>
      </div>
    ))}
  </div>
</ScrollShadow>
```
