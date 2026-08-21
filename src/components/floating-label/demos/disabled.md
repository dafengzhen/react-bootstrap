```tsx
<div className="d-flex flex-column gap-3">
  <FloatingLabel controlId="floatingInputDisabled" label="禁用的输入框">
    <FormControl disabled placeholder="name@example.com" type="text" />
  </FloatingLabel>
  <FloatingLabel controlId="floatingTextareaDisabled" label="禁用的文本域">
    <FormControl as="textarea" disabled placeholder="在此留言" style={{ height: 100 }} />
  </FloatingLabel>
  <FloatingLabel controlId="floatingSelectDisabled" label="禁用的下拉选择框">
    <FormSelect aria-label="禁用的浮动标签下拉选择框示例" disabled>
      <option selected>打开此选择菜单</option>
      <option value="1">选项 1</option>
      <option value="2">选项 2</option>
      <option value="3">选项 3</option>
    </FormSelect>
  </FloatingLabel>
</div>
```
