```tsx
<div className="d-flex flex-column gap-3">
  <InputGroup>
    <InputGroupText as="label" htmlFor="inputGroupSelect01">
      选项
    </InputGroupText>
    <FormSelect id="inputGroupSelect01">
      <option selected>选择...</option>
      <option value="1">选项 1</option>
      <option value="2">选项 2</option>
      <option value="3">选项 3</option>
    </FormSelect>
  </InputGroup>

  <InputGroup>
    <FormControl id="inputGroupFile01" type="file" />
    <InputGroupText as="label" htmlFor="inputGroupFile01">
      浏览
    </InputGroupText>
  </InputGroup>
</div>
```
