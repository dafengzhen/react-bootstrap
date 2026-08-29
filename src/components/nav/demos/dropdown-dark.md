```tsx
<Nav className="gap-1 mb-0" variant="pills">
  <NavItem>
    <NavLink active>首页</NavLink>
  </NavItem>
  <NavDropdown id="nav-dropdown-dark-demo" menuVariant="dark" title="深色菜单">
    <DropdownItem active className="my-1" eventKey="dark-1">
      激活项
    </DropdownItem>
    <DropdownItem className="my-1" eventKey="dark-2">操作</DropdownItem>
    <DropdownItem className="my-1" eventKey="dark-3">另一个操作</DropdownItem>
  </NavDropdown>
</Nav>
```
