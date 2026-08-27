```tsx
<ScrollShadow className="border rounded-3 bg-body" style={{ height: 240 }}>
  <ul className="list-group list-group-flush">
    {Array.from({ length: 12 }, (_, index) => (
      <li className="list-group-item" key={index}>
        <div className="fw-semibold">第 {index + 1} 条消息</div>
        <p className="mb-0 mt-1 text-muted small">
          向上或向下滚动容器，顶部和底部的阴影会随滚动位置自动淡入淡出，提示对应方向还有更多内容。
        </p>
      </li>
    ))}
  </ul>
</ScrollShadow>
```
