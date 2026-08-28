```tsx
<div className="d-flex flex-column gap-3">
  <Ratio as="figure" aspectRatio="16x9" className="bg-body-tertiary rounded">
    <img
      alt="示例图片"
      className="object-fit-cover"
      src="https://picsum.photos/seed/rbs-ratio-as/800/450"
    />
  </Ratio>
  <Ratio as="section" aspectRatio="4x3" className="bg-body-tertiary rounded">
    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
      as="section"
    </div>
  </Ratio>
</div>
```
