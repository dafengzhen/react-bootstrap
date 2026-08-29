```tsx
<Menu defaultActiveKey="profile" mode="inline" style={{ width: 240 }}>
  <MenuGroup label="常规">
    <MenuItem eventKey="home" icon={<House size={16} />}>
      首页
    </MenuItem>
    <MenuItem eventKey="profile" icon={<User size={16} />}>
      个人资料
    </MenuItem>
    <MenuItem eventKey="settings" icon={<Settings size={16} />}>
      设置
    </MenuItem>
  </MenuGroup>
  <MenuDivider />
  <MenuGroup label="帮助">
    <MenuItem eventKey="docs" icon={<FileText size={16} />}>
      文档
    </MenuItem>
    <MenuDivider />
    <MenuItem eventKey="feedback" icon={<MessageSquare size={16} />}>
      反馈
    </MenuItem>
  </MenuGroup>
</Menu>
```
