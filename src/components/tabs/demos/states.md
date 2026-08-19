```tsx
<Nav className="mb-3" variant="tabs">
  <NavItem>
    <NavLink active href="#tabs-states-demo">
      激活
    </NavLink>
  </NavItem>
  <NavItem>
    <NavLink href="#tabs-states-demo">链接</NavLink>
  </NavItem>
  <NavItem>
    <NavLink disabled href="#tabs-states-demo">
      禁用链接
    </NavLink>
  </NavItem>
  <NavItem>
    <NavLink disabled>禁用按钮</NavLink>
  </NavItem>
</Nav>

<Nav className="mb-0" defaultActiveKey="home" variant="pills">
  <NavItem>
    <NavLink eventKey="home">首页</NavLink>
  </NavItem>
  <NavItem>
    <NavLink eventKey="profile">个人资料</NavLink>
  </NavItem>
  <NavItem>
    <NavLink disabled eventKey="settings">
      设置
    </NavLink>
  </NavItem>
</Nav>
```
