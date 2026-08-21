```tsx
<div className="d-flex flex-column gap-3">
  <div>
    <FormRange aria-label="有效的范围示例" defaultValue={75} isValid />
    <div className="valid-feedback">看起来不错！</div>
  </div>
  <div>
    <FormRange aria-label="无效的范围示例" defaultValue={10} isInvalid />
    <div className="invalid-feedback">请选择一个值。</div>
  </div>
</div>
```
