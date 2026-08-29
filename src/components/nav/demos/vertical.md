```tsx
<Nav className="mb-3" vertical>
  <NavItem>
    <NavLink active href="#nav-vertical-demo">
      <House size={16} /> 首页
    </NavLink>
  </NavItem>
  <NavItem>
    <NavLink href="#nav-vertical-demo">
      <User size={16} /> 个人资料
    </NavLink>
  </NavItem>
  <NavItem>
    <NavLink href="#nav-vertical-demo">
      <Bell size={16} /> 通知
    </NavLink>
  </NavItem>
</Nav>

<Nav className="mb-0" variant="pills" vertical="lg">
  <NavItem>
    <NavLink active href="#nav-vertical-demo">
      <Folder size={16} /> 文件
    </NavLink>
  </NavItem>
  <NavItem>
    <NavLink href="#nav-vertical-demo">
      <FileText size={16} /> 文档
    </NavLink>
  </NavItem>
  <NavItem>
    <NavLink href="#nav-vertical-demo">
      <Settings size={16} /> 设置
    </NavLink>
  </NavItem>
</Nav>
```
