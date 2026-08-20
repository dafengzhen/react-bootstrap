```tsx
<div className="d-flex flex-wrap gap-2">
  <DropdownButton
    id="dropdown-dark-demo"
    menuVariant="dark"
    title="深色下拉按钮"
    variant="secondary"
  >
    <DropdownItem active>激活项</DropdownItem>
    <DropdownItem>操作</DropdownItem>
    <DropdownItem>另一个操作</DropdownItem>
    <DropdownItem>还有别的操作</DropdownItem>
  </DropdownButton>
  <Dropdown>
    <DropdownToggle id="dropdown-dark-split-demo" variant="dark">
      深色按钮
    </DropdownToggle>
    <DropdownMenu variant="dark">
      <DropdownItem active>激活项</DropdownItem>
      <DropdownItem>操作</DropdownItem>
      <DropdownItem>另一个操作</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>
```
