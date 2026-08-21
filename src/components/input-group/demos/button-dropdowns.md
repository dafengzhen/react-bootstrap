```tsx
<div className="d-flex flex-column gap-3">
  <InputGroup>
    <DropdownButton id="input-dropdown-addon-start" title="下拉菜单" variant="outline-secondary">
      <DropdownItem>操作</DropdownItem>
      <DropdownItem>另一个操作</DropdownItem>
      <DropdownItem>还有别的操作</DropdownItem>
      <DropdownDivider />
      <DropdownItem>分离的链接</DropdownItem>
    </DropdownButton>
    <FormControl aria-label="带下拉菜单的输入框" type="text" />
  </InputGroup>

  <InputGroup>
    <FormControl aria-label="右侧下拉菜单输入框" type="text" />
    <DropdownButton id="input-dropdown-addon-end" title="下拉菜单" variant="outline-secondary">
      <DropdownItem>操作</DropdownItem>
      <DropdownItem>另一个操作</DropdownItem>
      <DropdownItem>还有别的操作</DropdownItem>
    </DropdownButton>
  </InputGroup>
</div>
```
