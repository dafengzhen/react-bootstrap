```tsx
<div className="rounded" style={{ backgroundColor: '#212529', width: 240 }}>
  <Menu defaultActiveKey="home" defaultOpenKeys={['docs']} mode="inline" theme="dark">
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
</div>
```
