```tsx
const [collapsed, setCollapsed] = useState(false);

<div className="d-flex align-items-start gap-3">
  <Menu
    defaultActiveKey="home"
    defaultOpenKeys={['docs']}
    inlineCollapsed={collapsed}
    mode="inline"
    style={{ width: 220 }}
  >
    <MenuItem eventKey="home" icon={<House size={16} />}>
      首页
    </MenuItem>
    <MenuItem eventKey="profile" icon={<User size={16} />}>
      个人资料
    </MenuItem>
    <MenuSubMenu eventKey="docs" icon={<FileText size={16} />} title="文档">
      <MenuItem eventKey="guide">快速上手</MenuItem>
      <MenuItem eventKey="api">API 参考</MenuItem>
    </MenuSubMenu>
    <MenuItem eventKey="settings" icon={<Settings size={16} />}>
      设置
    </MenuItem>
  </Menu>
  <IconButton
    active={collapsed}
    className="align-self-start"
    label="折叠或展开"
    onClick={() => setCollapsed((prev) => !prev)}
    toggle
    variant="outline-primary"
  >
    <PanelLeft size={18} />
  </IconButton>
</div>;
```
