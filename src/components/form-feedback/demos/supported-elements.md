```tsx
<div className="d-flex flex-column gap-3">
  <div>
    <FormSelect aria-label="有效的下拉选择框示例" defaultValue="2" isValid>
      <option value="1">选项 1</option>
      <option value="2">选项 2</option>
      <option value="3">选项 3</option>
    </FormSelect>
    <FormFeedback type="valid">看起来不错！</FormFeedback>
  </div>
  <div>
    <FormRange aria-label="无效的范围示例" defaultValue={10} isInvalid />
    <FormFeedback type="invalid">请选择一个值。</FormFeedback>
  </div>
  <FormCheck>
    <FormCheckInput id="supportedCheck" isInvalid />
    <FormCheckLabel htmlFor="supportedCheck">无效的复选框</FormCheckLabel>
    <FormFeedback type="invalid">必须勾选此复选框。</FormFeedback>
  </FormCheck>
</div>
```
