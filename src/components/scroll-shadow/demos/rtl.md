```tsx
<ScrollShadow className="border rounded-3" direction="horizontal" dir="rtl">
  <div className="d-flex flex-nowrap gap-3 p-3">
    {Array.from({ length: 12 }, (_, index) => (
      <div className="card bg-body-tertiary" key={index} style={{ minWidth: 160 }}>
        <div className="card-body py-3">
          <h6 className="card-title mb-0">卡片 #{index + 1}</h6>
        </div>
      </div>
    ))}
  </div>
</ScrollShadow>
```
