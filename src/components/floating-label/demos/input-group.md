```tsx
<div className="d-flex flex-column gap-3">
  <InputGroup>
    <InputGroupText>@</InputGroupText>
    <FloatingLabel controlId="floatingInputGroup1" label="用户名">
      <FormControl placeholder="用户名" type="text" />
    </FloatingLabel>
  </InputGroup>
  <InputGroup hasValidation>
    <InputGroupText>@</InputGroupText>
    <FloatingLabel controlId="floatingInputGroup2" label="用户名">
      <FormControl
        aria-describedby="floatingInputGroup2Feedback"
        isInvalid
        placeholder="用户名"
        required
        type="text"
      />
    </FloatingLabel>
    <div className="invalid-feedback" id="floatingInputGroup2Feedback">
      请选择一个用户名。
    </div>
  </InputGroup>
</div>
```
