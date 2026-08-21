```tsx
<InputGroup hasValidation>
  <InputGroupText id="validation-addon">@</InputGroupText>
  <FormControl
    aria-describedby="validation-addon validation-feedback"
    aria-label="带校验反馈的输入框"
    isInvalid
    required
    type="text"
  />
  <div className="invalid-feedback" id="validation-feedback">
    请填写用户名。
  </div>
</InputGroup>
```
