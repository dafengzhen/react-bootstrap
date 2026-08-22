```tsx
<div className="d-flex flex-column gap-3">
  <div>
    <FormRange aria-label="有效的范围示例" defaultValue={75} isValid />
    <FormFeedback type="valid">看起来不错！</FormFeedback>
  </div>
  <div>
    <FormRange aria-label="无效的范围示例" defaultValue={10} isInvalid />
    <FormFeedback type="invalid">请选择一个值。</FormFeedback>
  </div>
</div>
```
