```tsx
<div>
  <FloatingLabel controlId="floatingInteractive" label="用户名">
    <FormControl onChange={handleChange} placeholder="请输入用户名" type="text" value={value} />
  </FloatingLabel>
  <FormText muted>{isEmpty ? '输入内容后标签会自动浮起' : `当前值：${value}`}</FormText>
</div>
```
