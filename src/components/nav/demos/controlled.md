```tsx
const [activeKey, setActiveKey] = useState('home');

<Nav
  activeKey={activeKey}
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
  <NavItem>
    <NavLink eventKey="profile">个人资料</NavLink>
  </NavItem>
  <NavItem>
    <NavLink eventKey="messages">消息</NavLink>
  </NavItem>
</Nav>;
```
