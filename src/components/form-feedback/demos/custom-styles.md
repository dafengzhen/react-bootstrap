```tsx
<div className="d-flex flex-column gap-3">
  <div>
    <FormControl aria-label="有效输入示例" isValid placeholder="有效输入" type="text" />
    <FormFeedback type="valid">看起来不错！</FormFeedback>
  </div>
  <div>
    <FormControl aria-label="无效输入示例" isInvalid placeholder="无效输入" type="text" />
    <FormFeedback type="invalid">请输入内容。</FormFeedback>
  </div>
</div>
```
