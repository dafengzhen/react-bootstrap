```tsx
const [activeKey, setActiveKey] = useState('home');

<Nav
  activeKey={activeKey}
  className="gap-1"
  onSelect={(key) => {
    if (key != null) {
      setActiveKey(String(key));
    }
  }}
  variant="pills"
>
  <NavItem>
    <NavLink eventKey="home">首页</NavLink>
  </NavItem>
  <NavDropdown eventKey="profile" id="nav-dropdown-active-demo" title="个人资料">
    <DropdownItem className="my-1" eventKey="profile">编辑资料</DropdownItem>
    <DropdownItem className="my-1" eventKey="settings">账号设置</DropdownItem>
  </NavDropdown>
  <NavItem>
    <NavLink eventKey="messages">消息</NavLink>
  </NavItem>
</Nav>;
```
