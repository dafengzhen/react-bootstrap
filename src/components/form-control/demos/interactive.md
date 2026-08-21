```tsx
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmpty = value.length === 0;
const isValidEmail = emailPattern.test(value);

<div>
  <FormControl
    aria-label="邮箱输入框"
    isInvalid={!isEmpty && !isValidEmail}
    isValid={!isEmpty && isValidEmail}
    onChange={handleChange}
    placeholder="输入邮箱地址"
    type="email"
    value={value}
  />
  <FormText muted>
    {isEmpty ? '请输入邮箱地址' : isValidEmail ? '邮箱格式正确' : '邮箱格式不正确'}
  </FormText>
</div>;
```
