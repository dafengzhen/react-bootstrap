```tsx
<div className="d-flex flex-wrap gap-2">
  <Dropdown autoClose id="dropdown-autoclose-true-demo">
    <DropdownToggle id="dropdown-autoclose-true-toggle" variant="secondary">
      默认（true）
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem>选择后关闭，外部点击也关闭</DropdownItem>
      <DropdownItem>另一个操作</DropdownItem>
    </DropdownMenu>
  </Dropdown>
  <Dropdown autoClose="inside" id="dropdown-autoclose-inside-demo">
    <DropdownToggle id="dropdown-autoclose-inside-toggle" variant="secondary">
      inside
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem>仅选择菜单项时关闭</DropdownItem>
      <DropdownItem>另一个操作</DropdownItem>
    </DropdownMenu>
  </Dropdown>
  <Dropdown autoClose="outside" id="dropdown-autoclose-outside-demo">
    <DropdownToggle id="dropdown-autoclose-outside-toggle" variant="secondary">
      outside
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem>仅点击外部时关闭</DropdownItem>
      <DropdownItem>另一个操作</DropdownItem>
    </DropdownMenu>
  </Dropdown>
  <Dropdown autoClose={false} id="dropdown-autoclose-false-demo">
    <DropdownToggle id="dropdown-autoclose-false-toggle" variant="secondary">
      false
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem>不会自动关闭</DropdownItem>
      <DropdownItem>另一个操作</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>
```
