```tsx
<Nav className="gap-1" defaultActiveKey="home" variant="pills">
  <NavItem>
    <NavLink eventKey="home">首页</NavLink>
  </NavItem>
  <NavDropdown eventKey="profile" id="nav-dropdown-basic-demo" title="个人资料">
    <DropdownItem className="my-1" eventKey="profile">编辑资料</DropdownItem>
    <DropdownItem className="my-1" eventKey="settings">账号设置</DropdownItem>
    <DropdownItem className="my-1" eventKey="logout">退出登录</DropdownItem>
  </NavDropdown>
</Nav>
```
