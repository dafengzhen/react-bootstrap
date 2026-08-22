```tsx
<div className="d-flex flex-column gap-3">
  <div>
    <FloatingLabel controlId="floatingInputValid" label="有效的输入框">
      <FormControl
        defaultValue="test@example.com"
        isValid
        placeholder="name@example.com"
        type="email"
      />
    </FloatingLabel>
    <FormFeedback type="valid">看起来不错！</FormFeedback>
  </div>
  <div>
    <FloatingLabel controlId="floatingInputInvalid" label="无效的输入框">
      <FormControl
        defaultValue="test@example.com"
        isInvalid
        placeholder="name@example.com"
        type="email"
      />
    </FloatingLabel>
    <FormFeedback type="invalid">请输入有效的邮箱地址。</FormFeedback>
  </div>
</div>
```
