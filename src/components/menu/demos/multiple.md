```tsx
<Menu defaultActiveKey={['home', 'docs']} multiple style={{ width: 220 }}>
  <MenuItem eventKey="home" icon={<House size={16} />}>
    首页
  </MenuItem>
  <MenuItem eventKey="docs" icon={<FileText size={16} />}>
    文档
  </MenuItem>
  <MenuItem eventKey="settings" icon={<Settings size={16} />}>
    设置
  </MenuItem>
  <MenuItem eventKey="messages" icon={<MessageSquare size={16} />}>
    消息
  </MenuItem>
</Menu>
```
