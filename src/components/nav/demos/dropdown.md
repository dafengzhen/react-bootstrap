```tsx
<Nav className="gap-1" variant="pills">
  <NavItem>
    <NavLink active>首页</NavLink>
  </NavItem>
  <NavItem>
    <NavLink>链接</NavLink>
  </NavItem>
  <NavDropdown id="nav-dropdown-demo" title="下拉菜单">
    <DropdownItem className="my-1" eventKey="action-1">操作一</DropdownItem>
    <DropdownItem className="my-1" eventKey="action-2">操作二</DropdownItem>
    <DropdownItem className="my-1" eventKey="action-3">操作三</DropdownItem>
  </NavDropdown>
</Nav>
```
