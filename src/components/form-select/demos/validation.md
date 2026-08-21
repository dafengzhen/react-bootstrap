```tsx
<div className="d-flex flex-column gap-3">
  <div>
    <FormSelect aria-label="有效的下拉选择框示例" defaultValue="2" isValid>
      <option value="1">选项 1</option>
      <option value="2">选项 2</option>
      <option value="3">选项 3</option>
    </FormSelect>
    <div className="valid-feedback">看起来不错！</div>
  </div>
  <div>
    <FormSelect aria-label="无效的下拉选择框示例" defaultValue="" isInvalid>
      <option value="">请选择一个选项</option>
      <option value="1">选项 1</option>
      <option value="2">选项 2</option>
      <option value="3">选项 3</option>
    </FormSelect>
    <div className="invalid-feedback">请选择一个选项。</div>
  </div>
</div>
```
