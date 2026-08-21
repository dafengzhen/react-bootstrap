```tsx
<div className="row g-2">
  <div className="col-md">
    <FloatingLabel controlId="floatingInputGrid" label="邮箱地址">
      <FormControl defaultValue="mdo@example.com" placeholder="name@example.com" type="email" />
    </FloatingLabel>
  </div>
  <div className="col-md">
    <FloatingLabel controlId="floatingSelectGrid" label="可用于下拉选择框">
      <FormSelect aria-label="布局浮动标签下拉选择框示例">
        <option selected>打开此选择菜单</option>
        <option value="1">选项 1</option>
        <option value="2">选项 2</option>
        <option value="3">选项 3</option>
      </FormSelect>
    </FloatingLabel>
  </div>
</div>
```
