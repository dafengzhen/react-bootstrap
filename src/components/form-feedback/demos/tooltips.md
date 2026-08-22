```tsx
<div className="d-flex flex-column gap-3">
  <div className="position-relative">
    <FormControl aria-label="工具提示有效输入示例" isValid required type="text" />
    <FormFeedback tooltip type="valid">
      看起来不错！
    </FormFeedback>
  </div>
  <div className="position-relative">
    <FormControl aria-label="工具提示无效输入示例" isInvalid required type="text" />
    <FormFeedback tooltip type="invalid">
      请输入内容。
    </FormFeedback>
  </div>
</div>
```
