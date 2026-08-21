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
    <div className="valid-feedback">看起来不错！</div>
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
    <div className="invalid-feedback">请输入有效的邮箱地址。</div>
  </div>
</div>
```
