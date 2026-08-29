```tsx
<Menu defaultActiveKey="home" mode="vertical" style={{ width: 220 }}>
  <MenuItem eventKey="home" icon={<House size={16} />}>
    首页
  </MenuItem>
  <MenuSubMenu eventKey="docs" icon={<FileText size={16} />} title="文档">
    <MenuItem eventKey="guide">快速上手</MenuItem>
    <MenuItem eventKey="api">API 参考</MenuItem>
  </MenuSubMenu>
  <MenuSubMenu eventKey="account" icon={<User size={16} />} title="账号">
    <MenuItem eventKey="profile">个人资料</MenuItem>
    <MenuItem eventKey="logout">退出登录</MenuItem>
  </MenuSubMenu>
  <MenuItem eventKey="settings" icon={<Settings size={16} />}>
    设置
  </MenuItem>
</Menu>
```
