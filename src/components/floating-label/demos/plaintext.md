```tsx
<div className="d-flex flex-column gap-3">
  <FloatingLabel controlId="floatingEmptyPlaintextInput" label="空输入框">
    <FormControl placeholder="name@example.com" plaintext readOnly type="email" />
  </FloatingLabel>
  <FloatingLabel controlId="floatingPlaintextInput" label="带默认值的输入框">
    <FormControl
      defaultValue="name@example.com"
      placeholder="name@example.com"
      plaintext
      readOnly
      type="email"
    />
  </FloatingLabel>
</div>
```
