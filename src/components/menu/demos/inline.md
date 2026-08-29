```tsx
<Menu defaultOpenKeys={['docs']} mode="inline" style={{ width: 240 }}>
  <MenuItem eventKey="home" icon={<House size={16} />}>
    首页
  </MenuItem>
  <MenuSubMenu eventKey="docs" icon={<FileText size={16} />} title="文档">
    <MenuItem eventKey="guide">快速上手</MenuItem>
    <MenuItem eventKey="api">API 参考</MenuItem>
    <MenuSubMenu eventKey="advanced" title="进阶">
      <MenuItem eventKey="theme">主题定制</MenuItem>
      <MenuItem eventKey="ssr">SSR 渲染</MenuItem>
    </MenuSubMenu>
  </MenuSubMenu>
  <MenuSubMenu eventKey="account" icon={<User size={16} />} title="账号">
    <MenuItem eventKey="profile">个人资料</MenuItem>
    <MenuItem eventKey="logout">退出登录</MenuItem>
  </MenuSubMenu>
</Menu>
```
